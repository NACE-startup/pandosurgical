# Pando Surgical website

Static marketing site for Pando Surgical. Plain HTML, one CSS file, one JS file. No framework, no npm.
Deployed on Vercel (NACE-startup/pandosurgical) from `main`. The old Next.js app is kept on the `legacy-nextjs` branch.

## How the site is built

- `tools/build.py` generates every `*.html` page. The nav, footer, log in pop-up, team members, news stories and legal pages live there.
  - **Never edit the `.html` files by hand.** Edit `tools/build.py`, then run `python3 tools/build.py` and commit the regenerated pages with it.
- `css/style.css` holds all styles. Edit it directly.
  - Two themes are CSS variables at the top: **cold** (default, Figma "Website (Ver2-Cold)") and **warm** (cream, Figma "Website (Ver1)"). Any color that differs per theme goes in a variable, not a hard-coded value.
- `js/main.js` holds all behavior: nav, theme toggle, reveal on scroll, tabs, modals, forms. Edit it directly.
- `assets/img`, `assets/icons`, `assets/video` hold the media.
- `vercel.json` tells Vercel (production branch `main`) to serve the files as a static site. Their Vercel project is set to Next.js, so without it the build fails.

## Design source of truth: Figma

- File: "Pando Surgical <> TroyLabs" (file key `qzadIMHmXLgcVp8am9XlpT`).
- Pages:
  - "Website (Ver2-Cold)" (`687:7266`) is the main version. Its "Wireframe Components" frame holds the components.
  - "Website (Ver1)" (`16:2`) is the warm version.
- **Keep both Figma versions and the site in sync.** When a design changes in one version, apply it to the other version and to the site, unless told otherwise.
- Match Figma values exactly (spacing, sizes, colors, shadows). Measure the site in the browser at 1512px wide, the Figma frame width, and compare numbers rather than eyeballing.
- When the site deliberately differs from Figma (for example the stronger team hover shadow), update the Figma component to match, and record the behavior in the component description.
- Figma can't express scroll-triggered motion. Record it as an annotation on the node.

## Conventions

- **Motion:**
  - Reveal on scroll: add class `reveal` (fades up 16px, 600ms). Images use the same entrance as the text beside them.
  - Soft easing: `var(--ease-soft)`.
  - Respect `prefers-reduced-motion`. The global rule in `style.css` covers CSS. Pause autoplaying video in JS.
- **Hover states:**
  - Team cards rise 6px and show a soft shadow. No border, no photo zoom.
  - News cards grow their panel 8px with a shadow. No photo zoom.
  - Use `:hover` plus keyboard focus (`:focus-visible` or `:has(:focus-visible)`). Don't use `:focus-within` for hover looks, because a mouse click leaves it stuck on.
- **Images:**
  - Download Figma assets into `assets/` (Figma URLs expire after 7 days).
  - Compress them, and crop to the visible area when Figma crops.
  - Target a few hundred KB at 2× resolution.
- **Video:**
  - Figma GIFs become muted, looping MP4s: `ffmpeg … -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart -an`. ffmpeg is installed via Homebrew.
  - Add a poster frame, and set `autoplay muted loop playsinline`.
- **Layout:**
  - Check phone width (375px) for horizontal overflow.
  - The tab bar never scrolls and keeps a fixed height.

## Working on it

- **Local preview:** run `python3 tools/serve.py` (in the background), then open http://localhost:8765/. It serves clean URLs like Vercel does (`/about`, not `/about.html`), which a plain `http.server` can't.
  - The browser caches CSS and JS. Reload with a cache bust, for example `fetch('css/style.css', {cache: 'reload'})`, before checking a change.
  - The built-in preview launcher can't read `~/Documents` (macOS privacy), so start the server from a shell instead.
- **Before pushing:**
  - Check the change in the browser at 1512px and 375px wide.
  - When the user asks to see something first, show a preview and wait for their OK.
- **Git:**
  - Work on `main`. Pushing to `main` publishes the site through Vercel.
  - Commit messages: a short summary line, then a few lines on what changed and why.
- **Backend (Firebase project `pandosurgical-608c2`):**
  - `js/firebase-config.js` holds the public web config, the `TEAM_EMAILS` list and the optional `APP_CHECK_SITE_KEY`. `js/firebase-init.js` starts Firebase.
  - `js/backend.js` runs on every page: the contact, careers and newsletter forms (saved to Firestore, no email sending), log in and live news. `js/dashboard.js` runs the team dashboard at `dashboard.html`.
  - The dashboard is for the team only, and it holds the inbox, applications, clinicians, newsletter, contacts, team invites and news posts.
  - Spam protection: a hidden `website` honeypot field, a 3 second minimum before a form sends, a 30 second cooldown per browser, size limits in `firestore.rules`, and App Check once a reCAPTCHA v3 key is set.
  - `firestore.rules` and `storage.rules` are the real security boundary. Keep the team email list the same in both files and in `firebase-config.js`. Deploy with `firebase deploy --only firestore:rules,storage`. The rules in the Firebase console may be newer than these files.
  - Add every site domain under Firebase Auth → Authorized domains, or Google sign-in fails.
- **Warm theme:** hidden. Set `THEME_SWITCHER = True` in `tools/build.py` and rebuild to show the Cold/Warm switch again.
  - Placeholders (stat source, some news dates) stay as they are until real content arrives.
- **3D model:** `assets/model/laprotator.glb` comes from "LapRotator render (revB).blend" via `tools/model.py` (run it with Blender 5.2, see the script). The poster image is a capture of the first frame at 1512px.
