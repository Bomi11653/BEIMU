from PIL import Image
from pathlib import Path

root = Path(r"d:\个人网站\BEIMU")
assets = Path(r"C:\Users\Administrator\.cursor\projects\d\assets")
about = root / "public" / "media" / "about"
partners = root / "public" / "media" / "partners"
about.mkdir(parents=True, exist_ok=True)
partners.mkdir(parents=True, exist_ok=True)

# --- 1) Avatar: tighter head crop ---
portrait_src = assets / (
    "c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_"
    "empty-window_images_2-436e3b95-3ee5-4be6-9749-f5cec70cd4bd.png"
)
img = Image.open(portrait_src).convert("RGB")
w, h = img.size
print("portrait", w, h)
# Face sits right of center; crop square around head, trim hand
cx, cy = int(w * 0.60), int(h * 0.26)
side = int(min(w, h) * 0.44)
left = max(0, cx - side // 2)
top = max(0, cy - int(side * 0.42))
right = min(w, left + side)
bottom = min(h, top + side)
left = max(0, right - side)
top = max(0, bottom - side)
head = img.crop((left, top, right, bottom)).resize(
    (1024, 1024), Image.Resampling.LANCZOS
)
head.save(about / "profile.jpg", quality=92, optimize=True)
print("saved profile", head.size, "box", (left, top, right, bottom))

# --- 2) 屠艺: white -> transparent; black ink -> white for dark UI ---
tuyi_src = assets / (
    "c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_"
    "empty-window_images______20260811141252_52_1218-a826a58c-2c58-434f-b053-b2bfad8d5684.png"
)
src = Image.open(tuyi_src).convert("RGBA")
out = Image.new("RGBA", src.size, (0, 0, 0, 0))
sp = src.load()
op = out.load()
tw, th = src.size
for y in range(th):
    for x in range(tw):
        r, g, b, a = sp[x, y]
        # near-white paper
        if r > 242 and g > 242 and b > 242:
            continue
        # soft paper fringe
        if r > 220 and g > 220 and b > 220:
            paper = (min(r, g, b) - 220) / 22.0
            alpha = int(255 * (1 - paper))
            if alpha < 8:
                continue
            # keep slight gray as faint ink edge -> white
            op[x, y] = (255, 255, 255, alpha)
            continue
        # red character (艺)
        if r > 90 and r > g * 1.35 and r > b * 1.35:
            op[x, y] = (r, g, b, 255)
            continue
        # black / dark ink (屠) -> white so visible on dark site
        lum = (r + g + b) / 3
        if lum < 80:
            op[x, y] = (255, 255, 255, 255)
        elif lum < 160:
            # mid gray stroke texture
            t = (lum - 80) / 80.0
            gray = int(255 * (1 - t * 0.35))
            op[x, y] = (gray, gray, gray, 255)
        else:
            # leftover paper speckles -> transparent-ish white
            alpha = int(255 * (1 - (lum - 160) / 95.0))
            if alpha > 20:
                op[x, y] = (255, 255, 255, max(0, min(255, alpha)))

bbox = out.getbbox()
out = out.crop(bbox)
side = max(out.size) + 80
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - out.size[0]) // 2
oy = (side - out.size[1]) // 2
canvas.paste(out, (ox, oy), out)
canvas = canvas.resize((800, 800), Image.Resampling.LANCZOS)
canvas.save(partners / "tuyi.png")
print("saved tuyi", canvas.size, "sample", canvas.getpixel((400, 280)), canvas.getpixel((10, 10)))

# --- 3) ALL LIVE: black -> transparent, keep white line art ---
all_live_src = root / ".tmp-partners" / "all-live-hold.jpg"
if not all_live_src.exists():
    raise SystemExit("missing all-live-hold.jpg")
src = Image.open(all_live_src).convert("RGBA")
out = Image.new("RGBA", src.size, (0, 0, 0, 0))
sp = src.load()
op = out.load()
aw, ah = src.size
for y in range(ah):
    for x in range(aw):
        r, g, b, a = sp[x, y]
        lum = (r + g + b) / 3.0
        if lum < 22:
            continue
        alpha = int(min(255, (lum - 22) * 1.25))
        if alpha < 8:
            continue
        op[x, y] = (255, 255, 255, alpha)

bbox = out.getbbox()
out = out.crop(bbox)
side = max(out.size) + 100
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - out.size[0]) // 2
oy = (side - out.size[1]) // 2
canvas.paste(out, (ox, oy), out)
canvas = canvas.resize((800, 800), Image.Resampling.LANCZOS)
canvas.save(partners / "all-live.png")
print("saved all-live", canvas.size, "sample", canvas.getpixel((400, 400)), canvas.getpixel((10, 10)))
print("done")
