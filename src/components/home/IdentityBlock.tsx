export function IdentityBlock() {
  return (
    <header className="identity-block">
      <p className="identity-brand">BEIMU_</p>

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
