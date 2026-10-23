"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { StageAudioToggle } from "./StageAudioToggle";

const EXIT_DURATION_MS = 780;
const MOBILE_INTRO_QUERY =
  "(max-width: 768px) and (orientation: portrait), (max-aspect-ratio: 10/16)";

type BrandIntroOverlayProps = {
  phase: "playing" | "exiting";
  onSkip: () => void;
  onExitComplete: () => void;
};

function pickIntroSrc(isMobilePortrait: boolean) {
  return portfolioAssetPath(
    isMobilePortrait
      ? brandAssets.brandIntroVideoMobile
      : brandAssets.brandIntroVideo,
  );
}

export function BrandIntroOverlay({
  phase,
  onSkip,
  onExitComplete,
}: BrandIntroOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const skipLockRef = useRef(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [isMobilePortrait, setIsMobilePortrait] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_INTRO_QUERY);
    const sync = () => setIsMobilePortrait(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // WeChat / iOS / X5 inline playback hints
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("playsinline", "true");
    video.setAttribute("x5-playsinline", "true");
    video.setAttribute("x5-video-player-type", "h5");
    video.setAttribute("x5-video-player-fullscreen", "false");
  }, [isMobilePortrait]);

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
    if (phase !== "playing" || isMobilePortrait === null) return;

    skipLockRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    video.muted = !audioEnabled;
    let cancelled = false;
    const play = () => {
      void video.play().then(
        () => { if (!cancelled) setNeedsGesture(false); },
        () => { if (!cancelled) setNeedsGesture(true); },
      );
    };
    play();
    document.addEventListener("WeixinJSBridgeReady", play);
    return () => {
      cancelled = true;
      document.removeEventListener("WeixinJSBridgeReady", play);
    };
  }, [audioEnabled, phase, isMobilePortrait]);

  useEffect(() => {
    if (phase !== "playing") return;
    let lastTime = 0;
    let lastProgress = Date.now();
    const watchdog = window.setInterval(() => {
      const video = videoRef.current;
      if (document.hidden) { lastProgress = Date.now(); return; }
      if (video && video.currentTime > lastTime + 0.05) {
        lastTime = video.currentTime;
        lastProgress = Date.now();
      } else if (Date.now() - lastProgress > 10000) {
        requestSkip();
      }
    }, 1000);
    return () => window.clearInterval(watchdog);
  }, [phase, requestSkip]);

  const handleSurfaceClick = useCallback(() => {
    if (phase !== "playing") return;

    if (needsGesture) {
      const video = videoRef.current;
      if (!video) {
        requestSkip();
        return;
      }

      video.muted = !audioEnabled;
      void video.play().then(
        () => {
          setNeedsGesture(false);
        },
        () => {
          requestSkip();
        },
      );
      return;
    }

    requestSkip();
  }, [audioEnabled, needsGesture, phase, requestSkip]);

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

  const posterSrc = portfolioAssetPath(brandAssets.brandIntroPoster);
  const videoSrc = isMobilePortrait === null ? undefined : pickIntroSrc(isMobilePortrait);

  return (
    <div className={`brand-intro-overlay is-${phase}`} aria-label="品牌开场动画" onTransitionEnd={(event) => {
      if (phase === "exiting" && event.target === event.currentTarget) onExitComplete();
    }}>
      <button
        type="button"
        className="brand-intro-video-hit"
        aria-label={
          needsGesture ? "点击播放品牌开场动画" : "跳过品牌开场动画"
        }
        onClick={handleSurfaceClick}
      >
        <video
          ref={videoRef}
          className={`brand-intro-video${isMobilePortrait ? " is-mobile-cover" : ""}`}
          src={videoSrc}
          poster={posterSrc}
          muted={!audioEnabled}
          autoPlay
          playsInline
          preload="metadata"
          onEnded={requestSkip}
          onError={requestSkip}
        />
        {needsGesture && phase === "playing" ? (
          <span className="brand-intro-gesture-hint">点击播放</span>
        ) : null}
      </button>

      {phase === "playing" ? (
        <button type="button" className="brand-intro-skip" onClick={requestSkip}>跳过开场 ↗</button>
      ) : null}
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
