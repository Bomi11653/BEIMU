"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "./vendor/SplitText";

export function KineticComposition({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(0);
  const complete = useCallback(() => setReady(value => value + 1), []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let active = true;
    const context = document.createElement("canvas").getContext("2d");
    const fit = () => {
      if (!active || !context) return;
      element.querySelectorAll<HTMLElement>(".kinetic-row").forEach(row => {
        context.font = '650 100px "Inter Variable"';
        const word = row.dataset.word ?? "";
        const size = row.clientWidth / (context.measureText(word).width - (word.length - 1) * 5) * 90;
        row.style.fontSize = `${size}px`;
        row.style.setProperty("--letter-height", String(Math.min(1.8, row.clientHeight / (size * 1.02))));
      });
    };
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    void document.fonts.ready.then(fit);
    fit();
    return () => { active = false; observer.disconnect(); };
  }, []);
  useGSAP(() => {
    const element = root.current;
    if (!element || reduced || ready < 3) return;
    const timeline = gsap.timeline({ onComplete: () => { element.dataset.settled = "true"; } });
    timeline.fromTo(".kinetic-building", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .65 }, 0);
    element.querySelectorAll(".kinetic-motion").forEach((row, index) => {
      timeline.fromTo(row, { yPercent: 125 + index * 14, xPercent: index === 1 ? 5 : -3, skewX: index === 1 ? 9 : -7, opacity: 0 },
        { yPercent: 0, xPercent: 0, skewX: 0, opacity: 1, duration: 1.65 + index * .13, ease: "power4.out" }, .2 + index * .16);
    });
    timeline.fromTo(".kinetic-rule", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "expo.out" }, .6);
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine)", () => {
      const layers = gsap.utils.toArray<HTMLElement>(".kinetic-parallax", element);
      const x = layers.map(layer => gsap.quickTo(layer, "x", { duration: .75, ease: "power3.out" }));
      const y = layers.map(layer => gsap.quickTo(layer, "y", { duration: .75, ease: "power3.out" }));
      const move = (event: PointerEvent) => {
        if (element.dataset.settled !== "true") return;
        const rect = element.getBoundingClientRect();
        layers.forEach((_, index) => { x[index](((event.clientX - rect.left) / rect.width - .5) * (index + 1) * 3); y[index](((event.clientY - rect.top) / rect.height - .5) * (index + 1) * 2); });
      };
      const leave = () => { x.forEach(update => update(0)); y.forEach(update => update(0)); };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      return () => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); };
    });
    return () => { media.revert(); delete element.dataset.settled; };
  }, { scope: root, dependencies: [reduced, ready], revertOnUpdate: true });
  return <div ref={root} className={`kinetic-composition${reduced ? " is-static" : ""}`}>
    <div className="kinetic-building"><span>BUILDING</span><span className="kinetic-rule" aria-hidden="true" /><span className="kinetic-edition">01—03 / BEIMU</span></div>
    <h1 className="type-lab-statement" aria-label="BUILDING WORLDS SYSTEMS STORIES">
      {["WORLDS", "SYSTEMS", "STORIES"].map((word, index) => <span className={`kinetic-row kinetic-row-${index}`} data-word={word} key={word} aria-hidden="true">
        <span className="kinetic-number">0{index + 1}</span><span className="kinetic-parallax"><span className="kinetic-stretch"><span className="kinetic-motion">
          {reduced ? word : <SplitText text={word} tag="span" splitType="words" trigger="load" duration={.01} delay={0}
            textAlign="left" from={{ opacity: 1 }} to={{ opacity: 1 }} onLetterAnimationComplete={complete} />}
        </span></span></span>
      </span>)}
    </h1>
  </div>;
}
