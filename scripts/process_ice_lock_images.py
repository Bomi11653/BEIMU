# -*- coding: utf-8 -*-
import re
from pathlib import Path
from PIL import Image

SRC = Path(r"E:\BEIMU\logo\冰锁寒川\- 冰锁寒川 -")
DEST = Path(r"d:\个人网站\BEIMU\public\media\works\3d-scene\ice-lock-cold-river")
MAX_EDGE = 1920
QUALITY = 88

DEST.mkdir(parents=True, exist_ok=True)

pat = re.compile(r"imgi_(\d+)_", re.I)
files = []
for p in SRC.iterdir():
    if not p.is_file():
        continue
    m = pat.search(p.name)
    if m:
        files.append((int(m.group(1)), p))

files.sort(key=lambda x: x[0])

mapping = []
cover_src_name = None
cover_out = None

for i, (num, src) in enumerate(files, start=1):
    out_name = f"{i:02d}.jpg"
    out_path = DEST / out_name

    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        long_edge = max(w, h)
        if long_edge > MAX_EDGE:
            scale = MAX_EDGE / long_edge
            new_size = (int(round(w * scale)), int(round(h * scale)))
            im = im.resize(new_size, Image.Resampling.LANCZOS)
        im.save(out_path, "JPEG", quality=QUALITY, optimize=True)

    mapping.append((src.name, out_name, num))
    if num == 9:
        cover_src_name = src.name
        cover_out = out_path

# cover = converted imgi_9 (second gallery item when 8 is first)
if cover_out and cover_out.exists():
    cover_path = DEST / "cover.jpg"
    cover_path.write_bytes(cover_out.read_bytes())
    print(f"cover.jpg <- {cover_src_name} ({cover_out.name})")
else:
    print("WARNING: imgi_9 not found for cover")

print("\n=== Mapping (source -> gallery) ===")
for src_name, out_name, num in mapping:
    print(f"imgi_{num}  {src_name}  ->  {out_name}")

print("\n=== Final files ===")
for p in sorted(DEST.iterdir()):
    if p.is_file():
        size_kb = p.stat().st_size / 1024
        with Image.open(p) as im:
            w, h = im.size
        print(f"{p.name:12s}  {w}x{h}  {size_kb:,.1f} KB  ({p.stat().st_size:,} bytes)")
