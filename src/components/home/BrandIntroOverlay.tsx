"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { StageAudioToggle } from "./StageAudioToggle";

const EXIT_DURATION_MS = 780;

type BrandIntroOverlayProps = {
  phase: "playing" | "exiting";
  onSkip: () => void;
  onExitComplete: () => void;
};

export function BrandIntroOverlay({
  phase,
  onSkip,
  onExitComplete,
}: BrandIntroOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const skipLockRef = useRef(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const requestSkip = useCallback(() => {
    if (skipLockRef.current || phase !== "playing") return;
    skipLockRef.current = true;
    onSkip();
  }, [onSkip, phase]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const timer = window.setTimeout(onExitComplete, EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onExitComplete, phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    skipLockRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    video.muted = !audioEnabled;
    void video.play().catch(() => {
      requestSkip();
    });
  }, [audioEnabled, phase, requestSkip]);

  const handleAudioToggle = useCallback(() => {
    setAudioEnabled((current) => {
      const next = !current;
      const video = videoRef.current;
      if (!video) return next;

      video.muted = !next;
      if (next) {
        void video.play().catch(() => undefined);
      }
      return next;
    });
  }, []);

  return (
    <div className={`brand-intro-overlay is-${phase}`} aria-hidden="true">
      <button
        type="button"
        className="brand-intro-video-hit"
        aria-label="跳过品牌开场动画"
        onClick={requestSkip}
      >
        <video
          ref={videoRef}
          className="brand-intro-video"
          src={portfolioAssetPath(brandAssets.brandIntroVideo)}
          muted={!audioEnabled}
          playsInline
          preload="auto"
          onEnded={requestSkip}
        />
      </button>

      {phase === "playing" ? (
        <StageAudioToggle
          enabled={audioEnabled}
          onToggle={handleAudioToggle}
        />
      ) : null}
    </div>
  );
}

export const BRAND_INTRO_EXIT_MS = EXIT_DURATION_MS;
