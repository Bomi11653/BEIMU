"use client";

import { useEffect, useRef, useState } from "react";
import type { CapabilityMedia } from "@/data/capabilities";

type BackgroundMediaProps = {
  media: CapabilityMedia;
  /** When false, portfolio videos stay hidden until brand intro completes. */
  revealed?: boolean;
};

const SWITCH_LOCK_MS = 340;
const HIDE_PAUSE_MS = 480;

/**
 * Stable dual-layer crossfade.
 * - Video nodes never remount (fixed keys) → no remount thrash on rapid clicks
 * - Clicks within SWITCH_LOCK_MS coalesce to the latest target only
 * - Sources only load after `revealed`; inactive layer uses preload=none
 */
export function BackgroundMedia({ media, revealed = true }: BackgroundMediaProps) {
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [layerMedia, setLayerMedia] = useState<[CapabilityMedia, CapabilityMedia]>([
    media,
    media,
  ]);

  const activeLayerRef = useRef<0 | 1>(0);
  const shownIdRef = useRef(media.id);
  const tokenRef = useRef(0);
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([
    null,
    null,
  ]);
  const lockUntilRef = useRef(0);
  const pendingRef = useRef<CapabilityMedia | null>(null);
  const flushTimerRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const targetLayerRef = useRef<0 | 1>(0);
  const revealedRef = useRef(revealed);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    revealedRef.current = revealed;
  }, [revealed]);

  // Coalesce rapid media requests into one swap.
  useEffect(() => {
    const startLayer = (next: CapabilityMedia) => {
      if (next.id === shownIdRef.current) return;

      shownIdRef.current = next.id;
      pendingRef.current = null;
      const token = ++tokenRef.current;
      const nextLayer = (activeLayerRef.current === 0 ? 1 : 0) as 0 | 1;
      targetLayerRef.current = nextLayer;
      lockUntilRef.current = performance.now() + SWITCH_LOCK_MS;

      setLayerMedia((current) => {
        const copy: [CapabilityMedia, CapabilityMedia] = [...current];
        copy[nextLayer] = next;
        return copy;
      });

      if (next.kind === "placeholder") {
        activeLayerRef.current = nextLayer;
        setActiveLayer(nextLayer);
        return;
      }

      void token;
    };

    if (media.id === shownIdRef.current && !pendingRef.current) {
      return;
    }

    const wait = lockUntilRef.current - performance.now();
    if (wait > 0) {
      pendingRef.current = media;
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
      }
      flushTimerRef.current = window.setTimeout(() => {
        flushTimerRef.current = null;
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending) startLayer(pending);
      }, wait);
      return;
    }

    startLayer(media);

    return () => {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [media]);

  // When a layer's media changes, wait for canplay then crossfade.
  useEffect(() => {
    if (!revealed) return;

    const layer = targetLayerRef.current;
    const next = layerMedia[layer];
    const token = tokenRef.current;

    if (next.kind !== "video") return;
    if (
      next.id === layerMedia[activeLayerRef.current]?.id &&
      activeLayerRef.current === layer
    ) {
      return;
    }

    const video = videoRefs.current[layer];
    if (!video) return;

    let cancelled = false;

    const reveal = () => {
      if (cancelled || tokenRef.current !== token || !revealedRef.current) return;
      activeLayerRef.current = layer;
      setActiveLayer(layer);

      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
      }
      pauseTimerRef.current = window.setTimeout(() => {
        const hidden = layer === 0 ? 1 : 0;
        const hiddenVideo = videoRefs.current[hidden];
        hiddenVideo?.pause();
        // Drop inactive source so it stops downloading.
        if (hiddenVideo) {
          hiddenVideo.removeAttribute("src");
          hiddenVideo.load();
        }
      }, HIDE_PAUSE_MS);
    };

    const playAndReveal = () => {
      if (cancelled || tokenRef.current !== token || !revealedRef.current) return;
      void video
        .play()
        .catch(() => undefined)
        .finally(reveal);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        if (video.currentTime > 0.05) video.currentTime = 0;
      } catch {
        /* ignore */
      }
      playAndReveal();
      return () => {
        cancelled = true;
      };
    }

    const onReady = () => {
      video.removeEventListener("canplay", onReady);
      playAndReveal();
    };
    video.addEventListener("canplay", onReady);
    // Ensure load starts after src attaches post-reveal.
    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener("canplay", onReady);
    };
  }, [layerMedia, revealed]);

  useEffect(() => {
    if (!revealed) {
      for (const video of videoRefs.current) {
        video?.pause();
      }
      return;
    }

    const layer = activeLayerRef.current;
    const current = layerMedia[layer];
    if (current.kind !== "video") return;

    const video = videoRefs.current[layer];
    if (!video) return;

    const playActive = () => {
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playActive();
      return;
    }

    const onReady = () => {
      video.removeEventListener("canplay", onReady);
      playActive();
    };
    video.addEventListener("canplay", onReady);
    video.load();

    return () => {
      video.removeEventListener("canplay", onReady);
    };
  }, [layerMedia, revealed, activeLayer]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current !== null) window.clearTimeout(flushTimerRef.current);
      if (pauseTimerRef.current !== null) window.clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <div
      className={revealed ? "stage-media is-revealed" : "stage-media"}
      aria-hidden="true"
    >
      {([0, 1] as const).map((layerIndex) => {
        const layer = layerMedia[layerIndex];
        const isActive = activeLayer === layerIndex;

        if (layer.kind !== "video") {
          return (
            <div
              className={`stage-video stage-video-placeholder${isActive ? " is-active" : ""}`}
              key={`layer-${layerIndex}`}
            />
          );
        }

        const shouldLoad = revealed && (isActive || layerIndex === targetLayerRef.current);

        return (
          <video
            className={`stage-video${isActive ? " is-active" : ""}`}
            key={`layer-${layerIndex}`}
            ref={(node) => {
              videoRefs.current[layerIndex] = node;
              if (node) {
                node.setAttribute("webkit-playsinline", "true");
                node.setAttribute("playsinline", "true");
                node.setAttribute("x5-playsinline", "true");
                node.setAttribute("x5-video-player-type", "h5");
              }
            }}
            muted
            loop
            playsInline
            preload={shouldLoad && isActive ? "metadata" : "none"}
            poster={layer.poster}
            src={shouldLoad ? layer.src : undefined}
            style={{ objectPosition: layer.objectPosition }}
          />
        );
      })}
      <div className="bottom-blur" />
    </div>
  );
}
