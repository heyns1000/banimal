#!/usr/bin/env python3
"""Generates the palette swatch downloads docs/brand/ci-guide.html already
links to (PNG at 1x/2x/3x, JPG, SVG, EPS, PDF per verified colour, plus a
combined sheet) into docs/brand/palettes/. These are flat colour chips, not
the fox-head mark or wordmark, so generating them carries none of the
guide's own "never redraw the mark" concern — nothing here is an
approximation of Sam Fox's artwork, just the exact verified hex values as
files instead of only as inline CSS.

Re-run after any change to the verified palette; the exact hex list here
must stay in sync with docs/brand/ci-guide.html section 03 and
src/worker/routes/brand-guide.ts's CI_GUIDE.palette (the deep dive that
required this script found this file, that route, and connector-icons.html
already agreed byte-for-byte — nothing here should ever be the odd one out).
"""
import os
from PIL import Image

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "brand", "palettes")

# name, filename-slug, hex — exact order and values from ci-guide.html section 03
PALETTE = [
    ("INK", "01_INK_231F20", "#231F20"),
    ("SAGE", "02_SAGE_577D60", "#577D60"),
    ("MINT", "03_MINT_A7DACB", "#A7DACB"),
    ("CORAL", "04_CORAL_F16B6E", "#F16B6E"),
    ("DUSTYROSE", "05_DUSTYROSE_B95F56", "#B95F56"),
    ("ARTCREAM", "06_ARTCREAM_F0EEDA", "#F0EEDA"),
    ("TEAL", "07_TEAL_1E9F97", "#1E9F97"),
    ("RED", "08_RED_E63946", "#E63946"),
    ("CREAM", "09_CREAM_FBF4E4", "#FBF4E4"),
]

SWATCH_PX = 512  # 1x


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def write_svg(path, hexval, size=512):
    with open(path, "w") as f:
        f.write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
            f'viewBox="0 0 {size} {size}"><rect width="{size}" height="{size}" '
            f'fill="{hexval}"/></svg>\n'
        )


def write_eps_grid(path, cells, cell_size):
    # cells: list of (row, col, rgb) — same vector-fill approach as
    # write_eps, just one rectfill per cell instead of one for the page.
    cols = max(c for _, c, _ in cells) + 1
    rows = max(r for r, _, _ in cells) + 1
    w, h = cols * cell_size, rows * cell_size
    with open(path, "w") as f:
        f.write(
            "%!PS-Adobe-3.0 EPSF-3.0\n"
            f"%%BoundingBox: 0 0 {w} {h}\n"
            "%%Creator: banimal generate-palette-assets.py\n"
            "%%EndComments\n"
            f"1 1 1 setrgbcolor 0 0 {w} {h} rectfill\n"
        )
        for row, col, rgb in cells:
            r, g, b = (c / 255 for c in rgb)
            x = col * cell_size
            y = h - (row + 1) * cell_size  # PostScript origin is bottom-left
            f.write(f"{r:.4f} {g:.4f} {b:.4f} setrgbcolor\n")
            f.write(f"{x} {y} {cell_size} {cell_size} rectfill\n")
        f.write("%%EOF\n")


def write_eps(path, rgb, size=512):
    # A flat colour swatch is a single fill, not per-pixel data — write real
    # vector PostScript instead of letting a raster-embed EPS bloat a solid
    # colour to 1.5MB+ per file for no reason.
    r, g, b = (c / 255 for c in rgb)
    with open(path, "w") as f:
        f.write(
            "%!PS-Adobe-3.0 EPSF-3.0\n"
            f"%%BoundingBox: 0 0 {size} {size}\n"
            "%%Creator: banimal generate-palette-assets.py\n"
            "%%EndComments\n"
            f"{r:.4f} {g:.4f} {b:.4f} setrgbcolor\n"
            f"0 0 {size} {size} rectfill\n"
            "%%EOF\n"
        )


def make_swatch(rgb, px):
    return Image.new("RGB", (px, px), rgb)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    sheet_cell = 200
    sheet = Image.new("RGB", (sheet_cell * 3, sheet_cell * 3), "#FFFFFF")
    sheet_cells = []

    for i, (name, slug, hexval) in enumerate(PALETTE):
        rgb = hex_to_rgb(hexval)
        base = f"SAMFOX_COLOUR{slug}"

        img1x = make_swatch(rgb, SWATCH_PX)
        img1x.save(os.path.join(OUT_DIR, f"{base}.png"))
        make_swatch(rgb, SWATCH_PX * 2).save(os.path.join(OUT_DIR, f"{base}_2x.png"))
        make_swatch(rgb, SWATCH_PX * 3).save(os.path.join(OUT_DIR, f"{base}_3x.png"))
        img1x.convert("RGB").save(os.path.join(OUT_DIR, f"{base}.jpg"), quality=95)
        img1x.save(os.path.join(OUT_DIR, f"{base}.pdf"))
        write_eps(os.path.join(OUT_DIR, f"{base}.eps"), rgb, SWATCH_PX)
        write_svg(os.path.join(OUT_DIR, f"{base}.svg"), hexval, SWATCH_PX)

        row, col = divmod(i, 3)
        cell = Image.new("RGB", (sheet_cell, sheet_cell), rgb)
        sheet.paste(cell, (col * sheet_cell, row * sheet_cell))
        sheet_cells.append((row, col, rgb))

        print(f"wrote {base}.{{png,_2x.png,_3x.png,jpg,pdf,eps,svg}}")

    sheet.save(os.path.join(OUT_DIR, "SAMFOX_COLOUR_SHEET.png"))
    sheet.convert("RGB").save(os.path.join(OUT_DIR, "SAMFOX_COLOUR_SHEET.jpg"), quality=95)
    sheet.save(os.path.join(OUT_DIR, "SAMFOX_COLOUR_SHEET.pdf"))
    write_eps_grid(os.path.join(OUT_DIR, "SAMFOX_COLOUR_SHEET.eps"), sheet_cells, sheet_cell)
    print("wrote SAMFOX_COLOUR_SHEET.{png,jpg,pdf,eps}")


if __name__ == "__main__":
    main()
