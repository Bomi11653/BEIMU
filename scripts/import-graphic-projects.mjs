import { readFile, readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const [burgerRoot, drinksRoot, halloweenRoot] = process.argv.slice(2);
if (!burgerRoot || !drinksRoot || !halloweenRoot) throw new Error("Supply burger, drinks and Halloween source directories.");
const destination = fileURLToPath(new URL("../public/media/works/graphic-design/", import.meta.url));
const burgerManifest = JSON.parse(await readFile(path.join(burgerRoot, "04_交接与清单/manifest_已验收资产.json"), "utf8"));
const halloweenFiles = (await readdir(halloweenRoot)).filter((file) => file.endsWith(".png")).sort();
const groups = [
  { slug: "burger-visual-design", files: burgerManifest["已验收作品"].map((item) => path.join(burgerRoot, item["文件"])) },
  { slug: "drinks-coffee-collection", files: Array.from({length:20}, (_, index) => path.join(drinksRoot, "PDF完整的商业/20_PAGE_PNG", `P${String(index + 1).padStart(2, "0")}.png`)) },
  { slug: "all-live-halloween", files: halloweenFiles.map((file) => path.join(halloweenRoot, file)) },
];

// Validate every source and destination before creating any web assets.
for (const group of groups) {
  for (const file of group.files) await access(file);
  try {
    await access(path.join(destination, group.slug));
  } catch {
    continue;
  }
  throw new Error(`Destination already exists; refusing to overwrite: ${group.slug}`);
}
for (const group of groups) {
  const target = path.join(destination, group.slug);
  await mkdir(target, { recursive: true });
  for (const [index, file] of group.files.entries()) {
    const output = path.join(target, `${String(index + 1).padStart(2, "0")}.webp`);
    await sharp(file).webp({lossless:true}).toFile(output);
    console.log(`${group.slug}/${String(index + 1).padStart(2, "0")} <- ${path.basename(file)}`);
  }
  await sharp(group.files[0]).resize({width:1200,withoutEnlargement:true}).webp({quality:94}).toFile(path.join(target, "cover.webp"));
}
