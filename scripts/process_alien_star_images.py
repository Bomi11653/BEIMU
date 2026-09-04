# -*- coding: utf-8 -*-
"""Process 异星 project images into Next.js public media."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image

SRC = Path(r"E:\BEIMU\logo\冰锁寒川\异星")
DEST = Path(r"d:\个人网站\BEIMU\public\media\works\3d-scene\alien-star")
MAX_EDGE = 1920
QUALITY = 88
IMGI_RE = re.compile(r"imgi_(\d+)_", re.IGNORECASE)


def is_landscape(size: tuple[int, int]) -> bool:
    w, h = size
    return w >= h * 1.2


def looks_like_title_card(img: Image.Image) -> bool:
    small = img.convert("RGB").resize((64, 36), Image.Resampling.BILINEAR)
    pixels = list(small.getdata())
    dark = sum(1 for r, g, b in pixels if r + g + b < 60)
    bright = sum(1 for r, g, b in pixels if r + g + b > 600)
    n = len(pixels)
    return (dark / n > 0.35 and bright / n > 0.02) or (dark / n > 0.55)


def base_key(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"\s*\(\d+\)\s*$", "", stem)
    return stem.lower()


def imgi_num(name: str) -> int:
    m = IMGI_RE.search(name)
    return int(m.group(1)) if m else 10**9


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)

    all_files = sorted(
        [p for p in SRC.iterdir() if p.is_file()],
        key=lambda p: p.name.lower(),
    )
    print("=== All source files ===")
    for p in all_files:
        print(f"  {p.name}  ({p.stat().st_size} bytes)")

    by_key: dict[str, list[Path]] = {}
    for p in all_files:
        by_key.setdefault(base_key(p.name), []).append(p)

    kept: list[Path] = []
    print("\n=== Deduplication ===")
    for key, group in sorted(by_key.items(), key=lambda x: imgi_num(x[1][0].name)):
        if len(group) == 1:
            kept.append(group[0])
            continue
        sizes = {g.stat().st_size for g in group}
        if len(sizes) == 1:
            preferred = sorted(
                group,
                key=lambda g: (1 if re.search(r"\(\d+\)", g.stem) else 0, g.name),
            )[0]
            print(f"  DROP duplicates same size ({next(iter(sizes))}):")
            for g in group:
                mark = "KEEP" if g == preferred else "skip"
                print(f"    [{mark}] {g.name}")
            kept.append(preferred)
        else:
            print(f"  Different sizes for key {key}, keeping all:")
            for g in group:
                print(f"    KEEP {g.name} ({g.stat().st_size})")
                kept.append(g)

    kept.sort(key=lambda p: (imgi_num(p.name), p.name.lower()))
    print("\n=== Sorted order (imgi_N) ===")
    for p in kept:
        print(f"  imgi_{imgi_num(p.name)} -> {p.name}")

    mapping: list[tuple[Path, Path, tuple[int, int], int]] = []
    print("\n=== Convert / resize ===")
    for i, src in enumerate(kept, start=1):
        out = DEST / f"{i:02d}.jpg"
        with Image.open(src) as im:
            im = im.convert("RGB")
            w, h = im.size
            long_edge = max(w, h)
            if long_edge > MAX_EDGE:
                scale = MAX_EDGE / long_edge
                nw, nh = int(round(w * scale)), int(round(h * scale))
                im = im.resize((nw, nh), Image.Resampling.LANCZOS)
            im.save(out, "JPEG", quality=QUALITY, optimize=True)
            ow, oh = im.size
        size_b = out.stat().st_size
        mapping.append((src, out, (ow, oh), size_b))
        print(f"  {src.name} -> {out.name}  {ow}x{oh}  {size_b} bytes")

    print("\n=== Cover selection ===")
    cover_src: Path | None = None
    cover_reason = ""

    title_candidates: list[Path] = []
    landscape_early: list[Path] = []
    for src in kept:
        with Image.open(src) as im:
            im_rgb = im.convert("RGB")
            size = im_rgb.size
            if looks_like_title_card(im_rgb):
                title_candidates.append(src)
                print(f"  title-card candidate: {src.name} {size[0]}x{size[1]}")
            if is_landscape(size):
                landscape_early.append(src)

    if title_candidates:
        def title_sort_key(p: Path):
            with Image.open(p) as im:
                sz = im.size
            return (0 if is_landscape(sz) else 1, imgi_num(p.name))

        title_candidates.sort(key=title_sort_key)
        cover_src = title_candidates[0]
        cover_reason = "title-card-like plate with text/dark field"
    else:
        preferred_nums = {8, 9, 10}
        preferred = []
        for p in kept:
            if imgi_num(p.name) in preferred_nums:
                with Image.open(p) as im:
                    if is_landscape(im.size):
                        preferred.append(p)
        if preferred:
            preferred.sort(key=lambda p: imgi_num(p.name))
            cover_src = preferred[0]
            cover_reason = f"early wide shot imgi_{imgi_num(cover_src.name)}"
        elif landscape_early:
            cover_src = landscape_early[0]
            cover_reason = "first landscape in sorted sequence"
        else:
            cover_src = kept[0]
            cover_reason = "fallback first in sorted sequence"

    cover_dest = DEST / "cover.jpg"
    matched = next((m for m in mapping if m[0] == cover_src), None)
    if matched:
        shutil.copy2(matched[1], cover_dest)
        print(f"COVER: {cover_src.name} -> cover.jpg (copy of {matched[1].name})")
        print(f"  reason: {cover_reason}")
        print(f"  size: {cover_dest.stat().st_size} bytes")
    else:
        with Image.open(cover_src) as im:
            im = im.convert("RGB")
            w, h = im.size
            long_edge = max(w, h)
            if long_edge > MAX_EDGE:
                scale = MAX_EDGE / long_edge
                im = im.resize(
                    (int(round(w * scale)), int(round(h * scale))),
                    Image.Resampling.LANCZOS,
                )
            im.save(cover_dest, "JPEG", quality=QUALITY, optimize=True)
        print(f"COVER: {cover_src.name} -> cover.jpg (re-encoded)")
        print(f"  reason: {cover_reason}")
        print(f"  size: {cover_dest.stat().st_size} bytes")

    print("\n=== Ordered mapping source -> numbered jpg ===")
    for src, out, (ow, oh), size_b in mapping:
        print(f"  {src.name} -> {out.name}  ({ow}x{oh}, {size_b} bytes)")

    print("\n=== Final files in dest ===")
    for p in sorted(DEST.iterdir(), key=lambda x: x.name):
        print(f"  {p.name}  {p.stat().st_size} bytes")


if __name__ == "__main__":
    main()
