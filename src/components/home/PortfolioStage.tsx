"use client";

import { useCallback, useEffect, useState } from "react";
import type { CapabilityMedia } from "@/data/capabilities";
import { BackgroundMedia } from "./BackgroundMedia";
import { BrandIntroOverlay } from "./BrandIntroOverlay";
import { IdentityBlock } from "./IdentityBlock";

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
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    brandIntroConsumedThisLoad ? "done" : "idle",
  );

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroPhase("done");
      return;
    }

    setIntroPhase("playing");
  }, [isActive]);

  useEffect(() => {
    onIntroActiveChange?.(introPhase === "playing" || introPhase === "exiting");
  }, [introPhase, onIntroActiveChange]);

  const handleIntroSkip = useCallback(() => {
    setIntroPhase("exiting");
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
          ? "home-stage-layer portfolio-stage intro-stage is-interactive"
          : "home-stage-layer portfolio-stage intro-stage"
      }
      aria-hidden={!isActive}
      aria-labelledby="portfolio-owner-name"
      inert={!isActive ? true : undefined}
      data-brand-intro={introPhase}
      onClick={handleStageClick}
    >
      <BackgroundMedia media={media} revealed={mediaRevealed} />

      <div
        className={
          mediaRevealed
            ? "stage-content is-revealed"
            : "stage-content"
        }
      >
        <IdentityBlock />

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
