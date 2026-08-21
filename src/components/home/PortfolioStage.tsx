import { capabilities } from "@/data/capabilities";
import { BackgroundMedia } from "./BackgroundMedia";
import { CapabilityNav } from "./CapabilityNav";
import { IdentityBlock } from "./IdentityBlock";

export function PortfolioStage() {
  return (
    <main className="portfolio-stage">
      <BackgroundMedia />

      <div className="stage-content">
        <CapabilityNav items={capabilities} />

        <IdentityBlock />

        <p className="portfolio-year">PORTFOLIO 2026</p>
        <p className="location-label">DONGGUAN · CHINA</p>
      </div>
    </main>
  );
}
