"use client";

import { useCallback, useEffect, useState } from "react";
import type { CapabilityMedia } from "@/data/capabilities";
import { BackgroundMedia } from "./BackgroundMedia";
import { BrandIntroOverlay } from "./BrandIntroOverlay";
import { IdentityBlock } from "./IdentityBlock";
import dynamic from "next/dynamic";
import "./home-silver-preview.css";
import { MobileHomeVideo } from "./MobileHomeVideo";

const HomeSilverMark = dynamic(() => import("./HomeSilverMark"), { ssr: false });
const localSilverPreview = true;

type IntroPhase = "idle" | "playing" | "exiting" | "done";

/** Persists for the current page load only — refresh resets intro playback. */
let brandIntroConsumedThisLoad = false;

type PortfolioStageProps = {
  media: CapabilityMedia;
  isActive: boolean;
  onIntroActiveChange?: (active: boolean) => void;
  onBackgroundClick?: () => void;
};

export function PortfolioStage({
  media,
  isActive,
  onIntroActiveChange,
  onBackgroundClick,
}: PortfolioStageProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {    if (brandIntroConsumedThisLoad) return "done";    return isActive ? "playing" : "idle";  });

  const mediaRevealed = introPhase === "exiting" || introPhase === "done";
  const showIntroOverlay =
    isActive && (introPhase === "playing" || introPhase === "exiting");

  useEffect(() => {
    if (isActive) return;

    setIntroPhase((current) => {
      if (current === "playing" || current === "exiting") {
        brandIntroConsumedThisLoad = true;
        return "done";
      }
      return current;
    });
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (brandIntroConsumedThisLoad) {
      setIntroPhase((current) => (current === "idle" ? "done" : current));
      return;
    }

    brandIntroConsumedThisLoad = true;

    // Mobile WebViews (especially WeChat) can leave an autoplaying video in a
    // pending state without reliably firing `ended` or `error`. The intro is a
    // desktop-only flourish; mobile should reach the usable homepage at once.
    const useDirectMobileEntry = window.matchMedia(
      "(max-width: 1024px) and (pointer: coarse)",
    ).matches;

    if (
      useDirectMobileEntry ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIntroPhase("done");
      return;
    }

    setIntroPhase("playing");
  }, [isActive]);

  useEffect(() => {
    onIntroActiveChange?.(introPhase === "playing" || introPhase === "exiting");
  }, [introPhase, onIntroActiveChange]);

  const handleIntroSkip = useCallback(() => {
    // Touch WebViews may suspend video/transition callbacks. Release the page
    // immediately on mobile instead of waiting for the desktop fade-out.
    const immediate = window.matchMedia("(pointer: coarse)").matches || /MicroMessenger/i.test(navigator.userAgent);
    setIntroPhase(immediate ? "done" : "exiting");
  }, []);

  const handleIntroExitComplete = useCallback(() => {
    setIntroPhase("done");
  }, []);

  const handleStageClick = useCallback(() => {
    if (!mediaRevealed || !onBackgroundClick) return;
    onBackgroundClick();
  }, [mediaRevealed, onBackgroundClick]);

  return (
    <section
      className={
        mediaRevealed && onBackgroundClick
          ? `home-stage-layer portfolio-stage intro-stage is-interactive${localSilverPreview ? " is-silver-preview" : ""}`
          : "home-stage-layer portfolio-stage intro-stage"
      }
      aria-hidden={!isActive}
      aria-labelledby="portfolio-owner-name"
      inert={!isActive ? true : undefined}
      data-brand-intro={introPhase}
      onClick={handleStageClick}
    >
      <BackgroundMedia media={media} revealed={mediaRevealed && isActive} />
      {localSilverPreview ? <MobileHomeVideo media={media} active={mediaRevealed && isActive} /> : null}
      {localSilverPreview ? <div className="silver-home-metal-layer" aria-hidden="true">
        <picture>
          <source media="(max-width: 700px)" srcSet="/brand/beimu-home-metal-frame-mobile-v2.png" />
          <img className="silver-home-metal-frame" src="/brand/beimu-home-metal-frame-wide-v1.png" alt="" />
        </picture>
        <span className="silver-home-metal-sweep" />
        <span className="silver-mobile-particles" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i />
        </span>
      </div> : null}

      <div
        className={
          mediaRevealed
            ? "stage-content is-revealed"
            : "stage-content"
        }
      >
        {localSilverPreview ? <header className="silver-home-identity">
          <div className="silver-home-chrome-name">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/beimu-name-chrome-v1.png" alt="" width={1536} height={1024} />
          </div>
          <h1 id="portfolio-owner-name" className="silver-home-name-accessible">郑荣成 / LEON</h1>
          <p className="silver-home-title">个人视觉设计师</p>
          <div className="silver-home-rule" />
          <p className="silver-home-services">从三维场景、商业海报到品牌网站，<br className="silver-home-copy-break" />为你的项目完成视觉设计与网站开发。</p>
          <ol><li>3D SCENES</li><li>VISUAL DESIGN</li><li>DIGITAL SYSTEMS</li></ol>
          <a href="/?stage=2" onClick={event => {
            event.preventDefault(); event.stopPropagation();
            window.dispatchEvent(new CustomEvent("beimu:site-nav", { detail: { href: "/?stage=2" } }));
          }}>查看精选案例 <span aria-hidden="true">↓</span></a>
        </header> : <IdentityBlock />}
        {localSilverPreview ? <HomeSilverMark active={mediaRevealed && isActive} /> : null}

        <p className="portfolio-year">PORTFOLIO 2026</p>
        <p className="location-label">DONGGUAN · CHINA</p>
      </div>

      {showIntroOverlay ? (
        <BrandIntroOverlay
          phase={introPhase === "playing" ? "playing" : "exiting"}
          onSkip={handleIntroSkip}
          onExitComplete={handleIntroExitComplete}
        />
      ) : null}
    </section>
  );
}
