import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const build = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: projectRoot,
  env: { ...process.env, SITES_BUILD: "1" },
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const distDir = new URL("../dist/", import.meta.url);
await rm(distDir, { recursive: true, force: true });
await mkdir(new URL("client/", distDir), { recursive: true });
await mkdir(new URL("server/", distDir), { recursive: true });
await mkdir(new URL(".openai/", distDir), { recursive: true });

await cp(new URL("../out/", import.meta.url), new URL("client/", distDir), {
  recursive: true,
});
await cp(
  new URL("../sites/worker.js", import.meta.url),
  new URL("server/index.js", distDir),
);
await cp(
  new URL("../.openai/hosting.json", import.meta.url),
  new URL(".openai/hosting.json", distDir),
);
