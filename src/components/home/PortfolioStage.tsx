import type { CapabilityMedia } from "@/data/capabilities";
import { BackgroundMedia } from "./BackgroundMedia";
import { IdentityBlock } from "./IdentityBlock";

type PortfolioStageProps = {
  media: CapabilityMedia;
  isActive: boolean;
};

export function PortfolioStage({ media, isActive }: PortfolioStageProps) {
  return (
    <section
      className="home-stage-layer portfolio-stage intro-stage"
      aria-hidden={!isActive}
      aria-labelledby="portfolio-owner-name"
      inert={!isActive ? true : undefined}
    >
      <BackgroundMedia media={media} />

      <div className="stage-content">
        <IdentityBlock />

        <p className="portfolio-year">PORTFOLIO 2026</p>
        <p className="location-label">DONGGUAN · CHINA</p>
      </div>
    </section>
  );
}
