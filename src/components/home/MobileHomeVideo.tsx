"use client";
import { useEffect, useRef } from "react";
import type { CapabilityMedia } from "@/data/capabilities";

export function MobileHomeVideo({ media, active }: { media: CapabilityMedia; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !active || media.kind !== "video") return;
    if (!matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.src = media.src;
    const play = () => { if (!document.hidden) void video.play().catch(() => undefined); };
    const visibility = () => { if (document.hidden) video.pause(); else play(); };
    document.addEventListener("WeixinJSBridgeReady", play);
    document.addEventListener("pointerdown", play, { once: true });
    document.addEventListener("visibilitychange", visibility);
    play();
    return () => { video.pause(); video.removeAttribute("src"); video.load(); document.removeEventListener("WeixinJSBridgeReady", play); document.removeEventListener("pointerdown", play); document.removeEventListener("visibilitychange", visibility); };
  }, [media, active]);
  return <video ref={ref} className="home-mobile-film" muted loop playsInline preload="none" aria-hidden="true" />;
}
