import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

function readOption(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const hostname = readOption("--host", "0.0.0.0");
const port = readOption("--port", "3000");
const compilerOption = args.includes("--turbopack") ? "--turbopack" : "--webpack";
const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const nextArgs = [nextBin, "dev", "--hostname", hostname, "--port", port];
if (compilerOption) {
  nextArgs.push(compilerOption);
}

const child = spawn(
  process.execPath,
  nextArgs,
  { stdio: "inherit" },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
