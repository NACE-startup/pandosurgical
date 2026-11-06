"""Makes the Spanish, Chinese and Japanese copies of the site.

build.py writes the English pages first. localize() then:
  1. fills in the language menu on every page,
  2. for each other language, copies every page into a folder (es/, zh/, ja/) and swaps the
     English text for the translation in translations/<lang>.json.

Translations are keyed by the English text exactly as it appears in the page HTML
(whitespace collapsed, entities such as &amp; left as written). Anything without a translation
stays in English, and a report at the end lists what is missing.
"""
import json
import re
from pathlib import Path

SITE_URL = "https://www.pandosurgical.com"

# code, short label in the menu, full name
LANGS = [("en", "EN", "English"), ("es", "ES", "Español"), ("zh", "中文", "中文"), ("ja", "日本語", "日本語")]
OTHERS = [l for l in LANGS if l[0] != "en"]
# Pages that are not copied per language (the team dashboard stays English).
SKIP = {"dashboard.html"}
# Legal pages stay in English (only the nav, footer and a notice are translated).
LEGAL = {"privacy.html", "terms.html", "accessibility.html"}

# Text that the scripts (js/main.js, js/backend.js) show. Sent to the page as window.PANDO_T.
JS_STRINGS = [
    "words", "Please keep this under {n} words.", "Show password", "Hide password",
    "Sending…", "Sorry, that didn’t go through. Please email contact@pandosurgical.com instead.",
    "Please wait {n} seconds before sending again.",
    "Thank you! Your message is on its way to the team. We read every one.",
    "Application received. Thank you! We’ll be in touch after reviewing it.",
    "You’re on the list. Thank you!",
    "Thank you! We’ll review your request and reach out.",
    "That email and password don’t match.",
    "An account with this email already exists. Try signing in.",
    "Please choose a password with at least 6 characters.",
    "Too many attempts. Please wait a moment and try again.",
    "This site’s address isn’t authorized in Firebase yet.",
    "Something went wrong. Please try again.",
    "This account doesn’t have team access. Use “Request access” below.",
    "Create team account", "Team email addresses only", "Welcome back", "Sign in to access your account",
    "Create account", "Sign in", "Create one", "Already have an account?", "Need a team account?",
    "Accounts are limited to team email addresses. Use “Request access” below.",
    "Enter your email above first, then press “Forgot password?”.",
    "If that account exists, a reset link is on its way.", "Couldn’t send the reset email.",
    "Dashboard", "Pando Surgical Team", "Read more →",
]

NOTICE_EN = "This page is available in English only."

# ---- text finding -----------------------------------------------------------------------
_INLINE = r"(?:<(?:em|strong|b|i|br|sup|sub|a|time)\b[^>]*>|</(?:em|strong|b|i|a|sup|sub|time)>)"
_UNIT = r"(?P<open><(?!(?:a|em|strong|b|i|br|sup|sub|time)\b)(?P<tag>[a-zA-Z0-9]+)\b[^>]*>)(?P<inner>(?:[^<]|" + _INLINE + r")+)(?P<close></(?P=tag)>)"
_TEXT = r"(?<=>)(?P<text>[^<>]+)(?=<)"
TEXT_RE = re.compile(_UNIT + "|" + _TEXT)
PROTECT_RE = re.compile(r"(<script\b.*?</script>|<style\b.*?</style>|<svg\b.*?</svg>)", re.S | re.I)
ATTR_RE = re.compile(r'\b(alt|aria-label|placeholder|title|content)="([^"]*)"')
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)


def _key(s):
    return re.sub(r"\s+", " ", s).strip()


_ANCHORS = re.compile(r"<(a|b|time)\b[^>]*>.*?</\1>", re.S)


def _has_words(s):
    if s.startswith(("@@", "http")) or re.match(r"^[a-z-]+=", s):
        return False  # menu placeholders, URLs, meta viewport
    if re.search(r"\d+(\.\d+)? ?mm", s) and len(s) < 45:
        return False  # lens and coupler sizes
    return re.search(r"[A-Za-z]{2,}", s) is not None


def _swap(raw, table, found):
    """Translate one chunk of text. Keeps the leading and trailing spaces."""
    k = _key(raw)
    if not _has_words(k):
        return raw
    found.add(k)
    new = table.get(k)
    if not new and k.endswith(" on LinkedIn") and "{name} on LinkedIn" in table:
        new = table["{name} on LinkedIn"].replace("{name}", k[: -len(" on LinkedIn")])
    if not new:
        return raw
    lead = raw[: len(raw) - len(raw.lstrip())]
    tail = raw[len(raw.rstrip()):]
    return lead + new + tail


def translate_html(html, table, found):
    # Hide scripts, styles and icons behind placeholders so the text next to them is still found.
    stash = []

    def hide(m):
        stash.append(m.group(0))
        return "<!--@@P%d@@-->" % (len(stash) - 1)

    seg = PROTECT_RE.sub(hide, html)

    def text(m):
        if m.group("text") is not None:
            return _swap(m.group("text"), table, found)
        if m.group("tag").lower() == "title":
            return m.group(0)
        inner = m.group("inner")
        if not _has_words(_ANCHORS.sub("", inner)) or not _has_words(re.sub(r"<[^>]+>", "", inner)):
            # Only links in here: translate each link's text on its own.
            return m.group("open") + TEXT_RE.sub(text, inner) + m.group("close")
        return m.group("open") + _swap(inner, table, found) + m.group("close")

    seg = TEXT_RE.sub(text, seg)
    seg = ATTR_RE.sub(lambda m: '%s="%s"' % (m.group(1), _swap(m.group(2), table, found)), seg)
    out = re.sub(r"<!--@@P(\d+)@@-->", lambda m: stash[int(m.group(1))], seg)

    def title(m):
        bits = m.group(1).split(" | ")
        return "<title>" + " | ".join(_swap(b, table, found) for b in bits) + "</title>"

    return TITLE_RE.sub(title, out)


# ---- language menu ----------------------------------------------------------------------
def _url(lang, name):
    base = "/" if lang == "en" else f"/{lang}/"
    return base if name == "index.html" else base + name[: -len(".html")]


def _menu(lang, name, chev):
    cur = next(l for l in LANGS if l[0] == lang)
    items = "".join(
        '<a href="%s" hreflang="%s" lang="%s"%s>%s</a>' % (_url(c, name), c, c, ' class="is-current"' if c == lang else "", full)
        for c, _short, full in LANGS)
    desktop = (f'<div class="dd lang-dd"><button class="nav-link dd-toggle" aria-expanded="false" aria-controls="dd-lang" '
               f'aria-label="Language">{cur[1]} {chev}</button><div class="dd-panel glass" id="dd-lang">{items}</div></div>')
    mobile = '<div class="row lang-row">' + "".join(
        '<a class="nav-link%s" href="%s" hreflang="%s" lang="%s">%s</a>' % (" is-current" if c == lang else "", _url(c, name), c, c, short)
        for c, short, _full in LANGS) + "</div>"
    return desktop, mobile


def _hreflang(name):
    tags = "".join(f'<link rel="alternate" hreflang="{c}" href="{SITE_URL}{_url(c, name)}">\n' for c, _s, _f in LANGS)
    return tags + f'<link rel="alternate" hreflang="x-default" href="{SITE_URL}{_url("en", name)}">\n'


def pretty_links(html, lang):
    """Links without .html (the site serves /about for about.html). Always from the site root."""
    base = "/" if lang == "en" else f"/{lang}/"

    def local(m):
        name, tail = m.group(1), m.group(2)
        return 'href="%s%s%s"' % (base, "" if name == "index" else name, tail)

    html = re.sub(r'href="([a-z]+)\.html((?:#[^"]*)?)"', local, html)
    # Links that already start from the root, or carry the full address
    def root(m):
        pre, path = m.group(1), m.group(2)
        path = re.sub(r"index$", "", path)
        return 'href="%s%s"' % (pre, path)
    html = re.sub(r'href="((?:%s)?/(?:(?:es|zh|ja)/)?)([a-z]*)\.html"' % re.escape(SITE_URL), root, html)
    return html


OG_LOCALE = {"en": "en_US", "es": "es_ES", "zh": "zh_CN", "ja": "ja_JP"}
OG_IMAGE = SITE_URL + "/assets/img/og-image.png"


def social_tags(html, lang, name):
    """Link preview tags (Open Graph and Twitter) built from the page's own title and description."""
    title = re.search(r"<title>(.*?)</title>", html, re.S)
    desc = re.search(r'<meta name="description" content="([^"]*)"', html)
    if not title or not desc:
        return html
    t, d, url = title.group(1), desc.group(1), SITE_URL + _url(lang, name)
    tags = (
        '<meta property="og:type" content="website">\n'
        '<meta property="og:site_name" content="Pando Surgical">\n'
        f'<meta property="og:title" content="{t}">\n'
        f'<meta property="og:description" content="{d}">\n'
        f'<meta property="og:url" content="{url}">\n'
        f'<meta property="og:image" content="{OG_IMAGE}">\n'
        '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
        f'<meta property="og:locale" content="{OG_LOCALE[lang]}">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{t}">\n'
        f'<meta name="twitter:description" content="{d}">\n'
        f'<meta name="twitter:image" content="{OG_IMAGE}">\n'
        f'<link rel="canonical" href="{url}">\n')
    return html.replace("</head>", tags + "</head>", 1)


def structured_data(html, lang, name):
    """Tells search engines the site's name and logo (home page of each language)."""
    if name != "index.html":
        return html
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Organization", "@id": SITE_URL + "/#org", "name": "Pando Surgical", "url": SITE_URL + "/",
             "logo": SITE_URL + "/assets/icons/favicon-512.png",
             "email": "contact@pandosurgical.com",
             "sameAs": ["https://www.linkedin.com/company/pandosurgical/", "https://www.youtube.com/@pandosurgical"]},
            {"@type": "WebSite", "@id": SITE_URL + "/#site", "name": "Pando Surgical", "url": SITE_URL + "/",
             "inLanguage": lang, "publisher": {"@id": SITE_URL + "/#org"}},
        ],
    }
    tag = '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>\n"
    return html.replace("</head>", tag + "</head>", 1)


def write_seo_files(root, names):
    """sitemap.xml (with every language) and robots.txt."""
    urls = []
    for name in names:
        alts = "".join(f'<xhtml:link rel="alternate" hreflang="{c}" href="{SITE_URL}{_url(c, name)}"/>' for c, _s, _f in LANGS)
        alts += f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE_URL}{_url("en", name)}"/>'
        for c, _s, _f in LANGS:
            urls.append(f"<url><loc>{SITE_URL}{_url(c, name)}</loc>{alts}</url>")
    (root / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(urls) + "\n</urlset>\n")
    (root / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /dashboard\n\nSitemap: {SITE_URL}/sitemap.xml\n")


def _fix_paths(html):
    """Pages in a language folder load shared files from the site root."""
    return re.sub(r'\b(src|href|poster)="((?:assets|css|js)/[^"]*)"', r'\1="/\2"', html)


def localize(root):
    root = Path(root)
    chev = None
    tables = {}
    for code, _s, _f in OTHERS:
        f = root / "translations" / f"{code}.json"
        tables[code] = json.loads(f.read_text()) if f.exists() else {}

    pages = sorted(p for p in root.glob("*.html"))
    english_keys = set()
    missing = {c: set() for c, _s, _f in OTHERS}

    for p in pages:
        src = p.read_text()
        if chev is None:
            chev = re.search(r'aria-controls="dd-product">Product (<svg.*?</svg>)', src, re.S)
            chev = chev.group(1) if chev else ""
        if p.name in SKIP:
            p.write_text(pretty_links(src.replace("@@LANGMENU@@", "").replace("@@LANGROW@@", ""), "en"))
            continue

        # English page: fill in the menu, add hreflang tags.
        d, mo = _menu("en", p.name, chev)
        en = src.replace("@@LANGMENU@@", d).replace("@@LANGROW@@", mo).replace("</head>", _hreflang(p.name) + "</head>", 1)
        p.write_text(structured_data(social_tags(pretty_links(en, "en"), "en", p.name), "en", p.name))

        found = set()
        if p.name in LEGAL:  # only the nav and footer of legal pages get translated
            head, _m, rest = src.partition('<main id="main">')
            _body, _m2, tail = rest.partition("</main>")
            translate_html(head, {}, found)
            translate_html(tail, {}, found)
        else:
            translate_html(src, {}, found)  # collect the English keys
        english_keys |= found

        for code, _short, _full in OTHERS:
            d, mo = _menu(code, p.name, chev)
            page = src.replace("@@LANGMENU@@", d).replace("@@LANGROW@@", mo).replace("</head>", _hreflang(p.name) + "</head>", 1)
            table = tables[code]
            if p.name in LEGAL:
                # Keep the legal text in English. Only the nav and footer are translated.
                head, sep, rest = page.partition('<main id="main">')
                main, sep2, tail = rest.partition("</main>")
                note = f'<p class="lang-note">{table.get(NOTICE_EN, NOTICE_EN)}</p>'
                main = re.sub(r'(<p class="updated">.*?</p>)', lambda m: m.group(1) + note, main, count=1)
                page = translate_html(head, table, set()) + sep + main + sep2 + translate_html(tail, table, set())
            else:
                page = translate_html(page, table, set())
            page = structured_data(social_tags(pretty_links(_fix_paths(page), code), code, p.name), code, p.name).replace('<html lang="en"', f'<html lang="{code}"', 1)
            t = {k: tables[code][k] for k in JS_STRINGS if k in tables[code]}
            page = page.replace("<head>", "<head>\n<script>window.PANDO_T=" + json.dumps(t, ensure_ascii=False) + "</script>", 1)
            out = root / code
            out.mkdir(exist_ok=True)
            (out / p.name).write_text(page)

    write_seo_files(root, [p.name for p in pages if p.name not in SKIP])
    english_keys |= set(JS_STRINGS) | {NOTICE_EN}
    (root / "translations").mkdir(exist_ok=True)
    (root / "translations" / "_keys.json").write_text(json.dumps(sorted(english_keys), ensure_ascii=False, indent=1))
    for code, _s, _f in OTHERS:
        miss = sorted(k for k in english_keys if k not in tables[code])
        print(f"  {code}: {len(english_keys) - len(miss)}/{len(english_keys)} strings translated")
