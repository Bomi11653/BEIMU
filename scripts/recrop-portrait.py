from PIL import Image
from pathlib import Path

root = Path(r"d:\个人网站\BEIMU")
assets = Path(r"C:\Users\Administrator\.cursor\projects\d\assets")
about = root / "public" / "media" / "about"
about.mkdir(parents=True, exist_ok=True)

portrait_src = assets / (
    "c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_"
    "empty-window_images_2-436e3b95-3ee5-4be6-9749-f5cec70cd4bd.png"
)
img = Image.open(portrait_src).convert("RGB")
w, h = img.size
print("source", w, h)

# Keep face + upper body + ambient cafe background.
# Subject sits on the right; leave window/rail on the left.
left = int(w * 0.22)
top = int(h * 0.02)
right = int(w * 0.96)
bottom = h

# Target site portrait aspect ~0.78 (width/height)
target_w, target_h = 800, 1024
box_w = right - left
box_h = bottom - top
target_ratio = target_w / target_h
cur_ratio = box_w / box_h

if cur_ratio > target_ratio:
    # too wide — trim sides toward subject
    new_w = int(box_h * target_ratio)
    trim = box_w - new_w
    left += int(trim * 0.25)
    right = left + new_w
else:
    # too tall — trim bottom a bit if needed
    new_h = int(box_w / target_ratio)
    if new_h < box_h:
        bottom = top + new_h

crop = img.crop((left, top, right, bottom))
print("crop box", (left, top, right, bottom), "size", crop.size)
out = crop.resize((target_w, target_h), Image.Resampling.LANCZOS)
out.save(about / "profile.jpg", quality=92, optimize=True)
print("saved", about / "profile.jpg", out.size)
