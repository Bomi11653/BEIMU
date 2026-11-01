import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:3000";
const profile = await mkdtemp(path.join(tmpdir(), "beimu-mobile-"));
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "about:blank",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
], { windowsHide: true, stdio: "ignore" });
let socket;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (fn, label) => {
  for (let i = 0; i < 100; i++) {
    const value = await fn();
    if (value) return value;
    await delay(150);
  }
  throw new Error(`Timed out: ${label}`);
};

try {
  const port = await until(async () => {
    try { return (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]; }
    catch { return null; }
  }, "Chrome startup");
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(pages.find((page) => page.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.method === "Runtime.exceptionThrown") errors.push(data.params.exceptionDetails.text);
    const request = pending.get(data.id);
    if (request) { pending.delete(data.id); if (data.error) request.reject(data.error); else request.resolve(data.result); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send("Page.enable");
  await send("Page.bringToFront");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setTouchEmulationEnabled", { enabled: true });
  const userAgent = process.argv[3] === "android"
    ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36 MicroMessenger/8.0.50"
    : "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.50";
  await send("Network.setUserAgentOverride", { userAgent });
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  // Reproduce a WebView that refuses autoplay. The visible skip must still work.
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error('Autoplay blocked in test')); };" });
  const navigate = async (route) => {
    await send("Page.navigate", { url: base + route });
    await until(() => evaluate("document.readyState === 'complete' && !!document.querySelector('main')"), route);
  };

  await navigate("/visual-lab");
  await until(() => evaluate("document.querySelector('.visual-lab-object')?.dataset.ready === 'true'"), "metal rendered");
  for (const width of [390, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    await delay(500);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth+1"), true);
  }
  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(profile, "lab-desktop.png"), Buffer.from(shot.data, "base64"));
  console.log("Screenshot: " + path.join(profile, "lab-desktop.png"));
  await evaluate("document.querySelector('.metallic-paint-canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true}))");
  await until(() => evaluate("getComputedStyle(document.querySelector('.visual-lab-fallback')).visibility === 'visible'"), "context loss fallback");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await until(() => evaluate("!document.querySelector('.metallic-paint-canvas')"), "reduced motion static");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args)};" });
  await send("Emulation.setEmulatedMedia", { features: [] });
  await navigate("/visual-lab");
  await delay(1000);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.visual-lab-fallback')).visibility"), "visible");
  assert.deepEqual(errors, []);
  console.log("PASS metallic render, desktop/mobile overflow, context loss, reduced motion and unavailable WebGL fallback");
} finally { socket?.close(); chrome.kill(); }

