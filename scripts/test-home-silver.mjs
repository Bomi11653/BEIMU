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
  // Reproduce a WebView that refuses autoplay. Mobile must bypass the video
  // intro entirely and expose the homepage without waiting for a media event.
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error('Autoplay blocked in test')); };" });
  const navigate = async (route) => {
    await send("Page.navigate", { url: base + route });
    await until(() => evaluate("document.readyState === 'complete' && !!document.querySelector('main')"), route);
  };
  const tap = async (selector) => {
    const point = await evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    assert.ok(point, `Missing tap target: ${selector}`);
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: point.x, y: point.y, id: 1 }] });
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };


  await navigate("/?stage=0");
  await until(()=>evaluate("document.querySelector('.home-stage')?.dataset.brandIntro==='done'"),"direct mobile entry");
  assert.equal(await evaluate("document.querySelector('.brand-intro-overlay') === null"),true);
  assert.equal(await evaluate("!document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.classList.contains('liquid-silver-canvas')"),true);
  assert.equal(await evaluate("document.querySelectorAll('[data-home-section]').length"), 3);
  await evaluate("document.querySelector('[data-home-section=\"2\"]').scrollIntoView()");
  await until(()=>evaluate("document.querySelector('.home-stage')?.dataset.activeStage === '2'"),"natural scroll to cases");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.category-index-scroll')).overflowY"), "visible");
  await navigate("/?stage=0");
  await until(()=>evaluate("document.querySelector('.home-stage')?.dataset.brandIntro==='done'"),"home after stage switch");
  await tap(".global-top-nav-toggle");
  await until(()=>evaluate("!!document.querySelector('.global-top-nav-drawer.is-open')"),"navigation menu touch tap");
  await until(()=>evaluate("document.querySelector('.home-silver-mark')?.dataset.ready==='true'"),"silver home");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.is-silver-preview > .stage-media')).filter"),"blur(20px)");
  assert.equal(await evaluate("document.querySelector('.liquid-sensor-toggle') === null"),true);
  // Synthetic inputs test rendering independently of secure-context sensor access.
  await evaluate("for(const [beta,gamma] of [[0,0],[8,12]]) { const event = new Event('deviceorientation'); Object.defineProperties(event,{beta:{value:beta},gamma:{value:gamma}}); window.dispatchEvent(event); }");
  await delay(900);
  assert.equal(await evaluate("parseFloat(document.querySelector('.portfolio-stage').style.getPropertyValue('--dot-x')) < -1"),true);
  for(const width of [390,1440]){
    await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<800});
    await delay(500);
    const shot=await send("Page.captureScreenshot",{format:"png"});
    const file=path.join(profile,'home-silver-'+width+'.png');
    await writeFile(file,Buffer.from(shot.data,"base64"));console.log(file);
  }
  assert.deepEqual(errors,[]);
  console.log("PASS homepage silver rendering and 20px blur");
} finally {socket?.close();chrome.kill();}

