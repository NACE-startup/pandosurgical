#!/usr/bin/env python3
"""Makes the favicon files from the logo mark (needs Pillow: pip3 install pillow).

    python3 tools/favicons.py "/path/to/rebrandedpandologo.png"

Writes favicon.ico (site root) and the PNG icons in assets/icons/. The mark is white on the
site's charcoal rounded square, the same look as assets/icons/favicon.svg.
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
CHARCOAL = (46, 49, 53, 255)


def icon(mark, size):
    scale = 8  # draw big, then shrink for smooth corners
    big = size * scale
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle((0, 0, big - 1, big - 1), radius=round(big * 0.21), fill=CHARCOAL)
    m = round(big * 0.58)
    h = m if mark.width >= mark.height else round(m * mark.height / mark.width)
    w = round(h * mark.width / mark.height)
    mk = mark.resize((w, h), Image.LANCZOS)
    img.alpha_composite(mk, ((big - w) // 2, (big - h) // 2))
    return img.resize((size, size), Image.LANCZOS)


def main(src):
    logo = Image.open(src).convert("RGBA")
    flat = Image.alpha_composite(Image.new("RGBA", logo.size, (255, 255, 255, 255)), logo).convert("L")
    box = ImageChops.difference(flat, Image.new("L", flat.size, 255)).getbbox()
    flat = flat.crop(box)
    # dark mark on white -> white mark with the darkness as its opacity
    darkest = flat.getextrema()[0]
    alpha = flat.point(lambda v: min(255, round((255 - v) * 255 / (255 - darkest))))
    mark = Image.new("RGBA", flat.size, (255, 255, 255, 0))
    mark.putalpha(alpha)
    icons = ROOT / "assets" / "icons"
    for name, size in (("favicon-48.png", 48), ("favicon-192.png", 192), ("favicon-512.png", 512), ("apple-touch-icon.png", 180)):
        icon(mark, size).save(icons / name, optimize=True)
    icon(mark, 256).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Wrote favicon.ico and icons in", icons)


if __name__ == "__main__":
    main(sys.argv[1])
