"use client";
import { useEffect, useRef } from "react";

export default function HomeSilverMark({ active }: { active: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = frame.current;
    if (!element || !active) return;
    const stage = element.closest<HTMLElement>(".portfolio-stage");
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      element.style.setProperty("--silver-x", `${(event.clientX / innerWidth - .5) * 12}px`);
      element.style.setProperty("--silver-y", `${(event.clientY / innerHeight - .5) * 8}px`);
    };
    const reset = () => { element.style.setProperty("--silver-x", "0px"); element.style.setProperty("--silver-y", "0px"); };
    const visibility = () => { element.dataset.paused = String(document.hidden); };
    stage?.addEventListener("pointermove", move);
    stage?.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => { stage?.removeEventListener("pointermove", move); stage?.removeEventListener("pointerleave", reset); document.removeEventListener("visibilitychange", visibility); reset(); };
  }, [active]);
  return <div ref={frame} className="home-silver-mark" data-active={active} aria-hidden="true"><div className="silver-flat-motion"><div className="silver-flat-material" /><div className="silver-flat-glint" /></div></div>;
}
