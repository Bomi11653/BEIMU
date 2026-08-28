import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outDir = new URL("../out/", import.meta.url);

const required = ["ALIYUN_OSS_BUCKET", "ALIYUN_OSS_REGION"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `Missing env: ${missing.join(", ")}. Example:\n` +
      "  ALIYUN_OSS_BUCKET=your-bucket\n" +
      "  ALIYUN_OSS_REGION=oss-cn-hangzhou\n" +
      "  ALIYUN_OSS_PREFIX=beimu   # optional\n" +
      "  OSSUTIL_CONFIG=/path/to/.ossutilconfig   # optional",
  );
  process.exit(1);
}

const build = spawnSync("npm.cmd", ["run", "build:sites"], {
  cwd: projectRoot,
  env: { ...process.env, SITES_BUILD: "1" },
  stdio: "inherit",
  shell: true,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(outDir)) {
  console.error("Build finished but ./out was not found.");
  process.exit(1);
}

const bucket = process.env.ALIYUN_OSS_BUCKET;
const region = process.env.ALIYUN_OSS_REGION;
const prefix = process.env.ALIYUN_OSS_PREFIX?.replace(/^\/+|\/+$/g, "") ?? "";
const ossTarget = prefix
  ? `oss://${bucket}/${prefix}/`
  : `oss://${bucket}/`;

const ossutilArgs = [
  "cp",
  "-r",
  "-f",
  fileURLToPath(outDir),
  ossTarget,
  "--region",
  region,
];

if (process.env.OSSUTIL_CONFIG) {
  ossutilArgs.push("-c", process.env.OSSUTIL_CONFIG);
}

console.log(`Uploading static site to ${ossTarget} (${region})`);

const upload = spawnSync("ossutil", ossutilArgs, {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

if (upload.status !== 0) {
  console.error(
    "ossutil upload failed. Install ossutil and configure credentials first:\n" +
      "  https://help.aliyun.com/document_detail/120072.html",
  );
  process.exit(upload.status ?? 1);
}

console.log("Aliyun OSS deploy complete.");
