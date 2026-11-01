"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import MetallicPaint from "./vendor/MetallicPaint";
import "./visual-lab.css";

const subscribe = (notify: () => void) => {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MetallicBrandLab() {
  const reduced = useSyncExternalStore(subscribe, getReducedMotion, () => true);
  const [hidden, setHidden] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const update = () => {
      element.dataset.ready = String(!!element.querySelector('canvas[data-rendered="true"]'));
    };
    const observer = new MutationObserver(update);
    observer.observe(element, { subtree: true, attributes: true, attributeFilter: ["data-rendered"], childList: true });
    update();
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <main id="main-content" className="visual-lab">
      <header className="visual-lab-heading">
        <p>BEIMU / MATERIAL STUDY 01</p>
        <h1>纯银 · 金属</h1>
      </header>
      <div className="visual-lab-object" ref={frame} role="img" aria-label="BEIMU 品牌符号轮廓的纯银金属材质实验">
        <div className="visual-lab-fallback" aria-hidden="true" />
        {!reduced ? <div className="visual-lab-live" aria-hidden="true">
          <MetallicPaint imageSrc="/brand/BEIMU_Symbol_White.svg" color="#ffffff00"
            backgroundColor="transparent" speed={0.18} density={2.2} softness={0.4}
            dispersion={0.04} distortion={0.12} edgeBend={0.6} mouseTilt={0.08}
            intro={false} scale={0.85} dpr={1} paused={hidden} />
        </div> : null}
      </div>
      <footer className="visual-lab-footer">
        <span>CHROME / SILVER</span>
        <p>品牌材质实验 · 非正式 Logo{reduced ? " · 静态模式" : ""}</p>
      </footer>
    </main>
  );
}
