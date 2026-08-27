import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";

export function IdentityBlock() {
  return (
    <header className="identity-block">
      <p className="identity-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="identity-brand-mark"
          src={portfolioAssetPath(brandAssets.symbolWhite)}
          alt="BEIMU"
          width={28}
          height={56}
        />
      </p>

      <div className="identity-main">
        <div className="identity-name-group">
          <h1 id="portfolio-owner-name">郑荣成</h1>
          <p className="identity-alias">LEON</p>
        </div>

        <div className="identity-statement">
          <p className="identity-kicker">BUILDING</p>
          <p className="identity-hero">
            <span>
              WORLDS<span className="identity-punct">,</span>
            </span>
            <span>
              SYSTEMS<span className="identity-punct">,</span>
            </span>
            <span>
              STORIES<span className="identity-punct">.</span>
            </span>
          </p>
        </div>
      </div>

      <ul className="identity-disciplines" aria-label="Practice areas">
        <li>3D ENVIRONMENTS</li>
        <li>AI DEVELOPMENT</li>
        <li>NEW MEDIA / MOTION</li>
      </ul>

      <div className="identity-meta">
        <p>DONGGUAN, CHINA</p>
      </div>
    </header>
  );
}
