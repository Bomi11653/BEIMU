import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  new URL("../dist/client/index.html", import.meta.url),
  new URL("../dist/server/index.js", import.meta.url),
  new URL("../dist/.openai/hosting.json", import.meta.url),
  new URL("../.openai/hosting.json", import.meta.url),
];

await Promise.all(requiredFiles.map((file) => access(file)));

const hosting = JSON.parse(
  await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
);

if (!hosting.project_id) {
  throw new Error("Sites project_id is missing");
}

console.log("Sites build verified.");
