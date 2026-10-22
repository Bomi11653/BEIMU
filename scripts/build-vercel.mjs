import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const build = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: projectRoot,
  // Vercel's Next.js adapter consumes .next, not the standalone out export.
  // Pages and OSS/Sites retain their separate static-export build commands.
  env: {
    ...process.env,
    SITES_BUILD: "0",
    GITHUB_PAGES: "false",
    NEXT_PUBLIC_BASE_PATH: "",
  },
  stdio: "inherit",
});

process.exit(build.status ?? 1);
