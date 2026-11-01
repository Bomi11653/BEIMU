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


  await navigate("/visual-lab/type");
  await until(() => evaluate("document.querySelector('.kinetic-composition')?.dataset.settled === 'true'"), "entrance timeline");
  for(const [width,height] of [[320,740],[390,844],[768,900],[1440,900]]){
    await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<800});
    await delay(500);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth+1"),true);
    assert.equal(await evaluate("[...document.querySelectorAll('.split-word')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight})"),true,`word bounds ${width}`);
    if(width===390||width===1440){
      const shot=await send("Page.captureScreenshot",{format:"png"});
      const file=path.join(profile,`type-v2-${width}.png`);
      await writeFile(file,Buffer.from(shot.data,"base64"));
      console.log("Screenshot: "+file);
    }
  }
  await evaluate("document.querySelector('.type-lab-footer button').click()");
  await until(() => evaluate("document.querySelector('.kinetic-composition')?.dataset.settled === 'true'"), "replay timeline");
  assert.equal(await evaluate("[...document.querySelectorAll('.split-word')].every(e=>Number(getComputedStyle(e).opacity)===1)"),true);
  await send("Emulation.setTouchEmulationEnabled",{enabled:false});
  await delay(300);
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:1100,y:500});
  await delay(900);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.kinetic-parallax')).transform !== 'none'"),true);
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:10,y:20});
  await delay(1200);
  assert.equal(await evaluate("Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.kinetic-parallax')).transform).m41)<.1"),true);
  const shot=await send("Page.captureScreenshot",{format:"png"});
  await writeFile(path.join(profile,"type-lab.png"),Buffer.from(shot.data,"base64"));
  console.log("Screenshot: "+path.join(profile,"type-lab.png"));
  await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  await until(()=>evaluate("document.querySelectorAll('.split-word').length===0 && document.querySelector('.type-lab-footer button').disabled"),"static preference");
  assert.equal(await evaluate("document.querySelector('h1').getAttribute('aria-label')"),"BUILDING WORLDS SYSTEMS STORIES");
  assert.deepEqual(errors,[]);
  console.log("PASS timeline, replay, readable word bounds at four widths and live reduced-motion fallback");
}finally{socket?.close();chrome.kill();}

