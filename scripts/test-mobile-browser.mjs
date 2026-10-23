import { spawn } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const profile = await mkdtemp(path.join(tmpdir(), "beimu-mobile-"));
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "about:blank",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
], { windowsHide: true, stdio: "ignore" });
let socket;
let inspect;
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
  inspect = evaluate;
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
  const tap = async (selector) => {
    await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center',behavior:'instant'})`);
    await delay(300);
    const point = await evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); if(!e)return null; const r=e.getBoundingClientRect(); const x=r.x+r.width/2,y=r.y+r.height/2; return {x,y,receivesTouch:e.contains(document.elementFromPoint(x,y))}; })()`);
    assert.ok(point, `Missing ${selector}`);
    assert.ok(point.receivesTouch, `Touch target is covered: ${selector}`);
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{x:point.x,y:point.y,radiusX:1,radiusY:1,force:1,id:1}] });
    await delay(80);
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  await navigate("/?stage=0");
  await until(() => evaluate("!!document.querySelector('.brand-intro-skip')"), "intro skip");
  await tap(".brand-intro-skip");
  await until(() => evaluate("!document.querySelector('.brand-intro-overlay')"), "skip intro");
  console.log("PASS blocked autoplay can be skipped");
  await tap(".global-top-nav-toggle");
  await until(() => evaluate("!!document.querySelector('#global-top-nav-menu')"), "mobile menu");
  await tap('.global-top-nav-drawer-link[href$="stage=2"]');
  await until(() => evaluate("location.search.includes('stage=2') && document.querySelector('main')?.dataset.activeStage === '2'"), "mobile works menu");
  console.log("PASS mobile menu opens works");
  await navigate("/?stage=0");
  await until(() => evaluate("!document.querySelector('.brand-intro-overlay')"), "stalled intro watchdog");
  console.log("PASS stalled intro exits without a tap");
  await navigate("/?stage=2");
  await until(() => evaluate("document.querySelectorAll('.category-index-item').length === 5"), "five categories");
  for (const width of [320, 390, 430, 768]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: true });
    await delay(150);
    assert.equal(await evaluate("(() => {const e=document.querySelector('.category-index-scroll');return e.scrollWidth<=e.clientWidth+1})()"), true, `Overflow at ${width}px`);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await tap('.category-index-link[href$="/works/graphic-design"]');
  await until(() => evaluate("location.pathname.includes('/works/graphic-design') && !!document.querySelector('.project-file-list')"), "category tap");
  console.log("PASS touch category navigation and 320/390/430/768px widths");
  await tap('.project-file-row[href$="burger-visual-design"]');
  await until(() => evaluate("location.pathname.includes('burger-visual-design') && document.querySelectorAll('.project-image-trigger').length === 9"), "project tap");
  assert.equal(await evaluate("document.querySelector('.project-image-trigger img').getAttribute('src').includes('-thumb.webp')"), true);
  await tap(".project-image-trigger");
  await until(() => evaluate("!!document.querySelector('dialog[open]')"), "image dialog");
  assert.equal(await evaluate("document.querySelector('dialog[open] img').getAttribute('src').includes('-thumb.webp')"), false);
  await tap("dialog[open] button[aria-pressed]");
  assert.equal(await evaluate("document.querySelector('dialog[open] .project-image-canvas').dataset.zoomed"), "true");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await until(() => evaluate("!document.querySelector('dialog[open]')"), "dialog close");
  assert.deepEqual(errors, []);
  console.log("PASS touch project navigation, thumbnail/full-image split, zoom and close");
} catch (error) {
  if (inspect) console.error(await inspect(`JSON.stringify({url:location.href,visibility:document.visibilityState,stages:[...document.querySelectorAll('main')].map(e=>({data:e.dataset,hidden:e.closest('[hidden]')?.id})),overlays:[...document.querySelectorAll('.brand-intro-overlay')].map(e=>({class:e.className,hidden:e.closest('[hidden]')?.id,rect:e.getBoundingClientRect().toJSON()}))})`));
  throw error;
} finally {
  socket?.close();
  chrome.kill();
}
