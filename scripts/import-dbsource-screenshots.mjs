import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const source = 'E:/卓面应用/个人文件/Cursor/dBsource-main/网站截图';
const target = 'public/media/works/ai-development/dbsource-pro';
const names = ['网站首页.png', '网站产品也设计.png', '网站产品详情页设计.png', '网站产品详情页设计02.png', '网站演出和工程案例页.png', '网站下载页.png', '网站自制后台设计.png'];
await mkdir(target, { recursive: true });
for (const [index, name] of names.entries()) {
  const id = String(index + 1).padStart(2, '0');
  await sharp(path.join(source, name)).webp({ lossless: true }).toFile(`${target}/case-${id}.webp`);
  await sharp(path.join(source, name)).resize({ width: index < 2 ? 1440 : 1000, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`${target}/case-${id}-preview.webp`);
}
console.log('Imported 7 screenshots; original files preserved.');
