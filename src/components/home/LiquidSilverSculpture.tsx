"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

export function LiquidSilverSculpture({ reduced }: { reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const frame = element.closest<HTMLElement>(".home-silver-mark");
    const stage = element.closest<HTMLElement>(".portfolio-stage");
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 30);
    camera.position.z = 5.6;
    const room = new THREE.Scene();
    room.background = new THREE.Color(0x080808);
    const panels: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    for (const [x,y,z,w,h] of [[-1.1,0,5,2.5,7],[-3,1,4,1.1,7],[3,0,3,.5,6],[0,4,1,5,.6],[0,-3,4,4,.4]]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));
      panel.position.set(x,y,z); panel.lookAt(0,0,0); room.add(panel); panels.push(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    panels.forEach(panel=>{panel.geometry.dispose();panel.material.dispose();}); pmrem.dispose();
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(-3, 4, 5); scene.add(light);
    const group = new THREE.Group(); scene.add(group);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xe9e9e9, metalness: 1, roughness: .12, clearcoat: 1, clearcoatRoughness: .08, side: THREE.DoubleSide });
    const geometries: { geometry: THREE.BufferGeometry; base: Float32Array }[] = [];
    const controller = new AbortController();
    let alive = true, ready = false, raf = 0, last = 0;
    const target = { x: 0, y: 0 }, current = { x: 0, y: 0 };
    let dragging = false;
    let baseline: { beta: number; gamma: number } | null = null;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
      if (ready) renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const draw = (now: number) => {
      if (!alive) return;
      raf = 0;
      const dt = Math.min((now - last) / 1000 || .016, .05); last = now;
      const damping = 1 - Math.exp(-dt * 5);
      current.x += (target.x - current.x) * damping; current.y += (target.y - current.y) * damping;
      group.rotation.set(-current.y * .22, -.12 + current.x * .4, -.025 + current.x * .035);
      geometries.forEach(({ geometry, base }) => {
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
          const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
          const twist = y * (.08 + current.x * .2);
          position.setXYZ(i, x * Math.cos(twist) - z * Math.sin(twist), y + Math.sin(y * 3 + current.x) * current.y * .025,
            x * Math.sin(twist) + z * Math.cos(twist) + Math.sin(y * 2.5) * current.y * .08);
        }
        position.needsUpdate = true; geometry.computeVertexNormals();
      });
      stage?.style.setProperty("--dot-x", `${-current.x * 12}px`);
      stage?.style.setProperty("--dot-y", `${-current.y * 10}px`);
      renderer.render(scene, camera);
      if (ready) { renderer.domElement.dataset.rendered = "true"; if (frame) frame.dataset.ready = "true"; }
      if (!reduced && !document.hidden && (Math.abs(target.x-current.x)+Math.abs(target.y-current.y) > .001)) raf = requestAnimationFrame(draw);
    };
    const wake = () => { if (!raf && !document.hidden && alive) raf = requestAnimationFrame(draw); };
    const reset = () => { dragging = false; target.x = 0; target.y = 0; wake(); };
    const move = (event: PointerEvent) => {
      if (reduced || (event.pointerType !== "mouse" && !dragging)) return;
      const rect = element.getBoundingClientRect();
      target.x = THREE.MathUtils.clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);
      target.y = THREE.MathUtils.clamp((event.clientY-rect.top)/rect.height*2-1,-1,1); wake();
    };
    const down = (event: PointerEvent) => { if (reduced) return; dragging = true; element.setPointerCapture(event.pointerId); move(event); };
    const orientation = (event: DeviceOrientationEvent) => {
      if (reduced || event.beta === null || event.gamma === null) return;
      baseline ??= { beta: event.beta, gamma: event.gamma };
      target.x = THREE.MathUtils.clamp((event.gamma-baseline.gamma)/25,-1,1);
      target.y = THREE.MathUtils.clamp((event.beta-baseline.beta)/25,-1,1); wake();
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf=0; } else wake(); };
    const lost = () => { ready=false; if(frame) frame.dataset.ready="false"; cancelAnimationFrame(raf); raf=0; };
    element.addEventListener("pointerdown", down); element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", reset); element.addEventListener("pointercancel", reset); element.addEventListener("pointerleave", reset);
    window.addEventListener("deviceorientation", orientation); document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    void fetch("/brand/BEIMU_Symbol_White.svg", { signal: controller.signal }).then(response => { if(!response.ok)throw new Error("SVG unavailable");return response.text(); }).then(svg => {
      if (!alive) return;
      const data = new SVGLoader().parse(svg);
      for (const path of data.paths) for (const shape of path.toShapes()) {
        const raw = new THREE.ExtrudeGeometry(shape, { depth: 15, bevelEnabled: true, bevelThickness: 5, bevelSize: 2.3, bevelSegments: 5, steps: 4, curveSegments: 8 });
        raw.deleteAttribute("normal"); raw.deleteAttribute("uv");
        const geometry = mergeVertices(raw); raw.dispose(); geometry.computeVertexNormals();
        geometry.scale(.0065,-.0065,.0065);
        const mesh = new THREE.Mesh(geometry, material); group.add(mesh);
      }
      const center = new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());
      group.children.forEach(child => {
        const mesh = child as THREE.Mesh<THREE.BufferGeometry>; mesh.geometry.translate(-center.x,-center.y,-center.z);
        geometries.push({ geometry: mesh.geometry, base: new Float32Array(mesh.geometry.attributes.position.array) });
      });
      ready = true; wake();
    }).catch(() => { /* Static silver fallback remains visible. */ });
    return () => {
      alive=false; controller.abort(); cancelAnimationFrame(raf); observer.disconnect();
      element.removeEventListener("pointerdown", down); element.removeEventListener("pointermove", move); element.removeEventListener("pointerup", reset);
      element.removeEventListener("pointercancel", reset); element.removeEventListener("pointerleave", reset);
      window.removeEventListener("deviceorientation", orientation); document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      geometries.forEach(({geometry})=>geometry.dispose()); material.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
      if(frame)frame.dataset.ready="false"; stage?.style.removeProperty("--dot-x"); stage?.style.removeProperty("--dot-y");
    };
  }, [reduced]);
  return <div ref={host} className="liquid-silver-canvas" role="img" aria-label="可拖动的 BEIMU 液态银立体雕塑" onClick={event => event.stopPropagation()} />;
}
