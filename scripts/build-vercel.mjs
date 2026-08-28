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

process.exit(build.status ?? 1);
