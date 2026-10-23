import { readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/media/works/graphic-design/", import.meta.url));
let originalBytes = 0;
let thumbnailBytes = 0;
let count = 0;
for (const directory of await readdir(root, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const folder = path.join(root, directory.name);
  for (const name of await readdir(folder)) {
    if (!/^\d{2}\.webp$/.test(name)) continue;
    const input = path.join(folder, name);
    const result = await sharp(input).resize({width:640,withoutEnlargement:true}).webp({quality:86}).toFile(path.join(folder, name.replace(".webp", "-thumb.webp")));
    originalBytes += (await stat(input)).size;
    thumbnailBytes += result.size;
    count++;
  }
}
console.log(JSON.stringify({ count, originalBytes, thumbnailBytes }));
