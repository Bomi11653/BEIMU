"use client";

import { useState, useSyncExternalStore } from "react";
import { KineticComposition } from "./KineticComposition";
import "./type-lab.css";

const subscribe = (notify: () => void) => {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const snapshot = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function TypeLab() {
  const reduced = useSyncExternalStore(subscribe, snapshot, () => true);
  const [replay, setReplay] = useState(0);
  return (
    <main id="main-content" className="type-lab">
      <header className="type-lab-heading"><p>BEIMU / TYPE STUDY 02</p><span>FORM FOLLOWS EXPRESSION</span></header>
      <KineticComposition key={`${replay}-${reduced}`} reduced={reduced} />
      <footer className="type-lab-footer">
        <p>{reduced ? "静态模式 · 减少动态效果" : "WORLDS / SYSTEMS / STORIES"}</p>
        <button type="button" onClick={() => setReplay(value => value + 1)} disabled={reduced}>重新播放 ↻</button>
      </footer>
    </main>
  );
}
