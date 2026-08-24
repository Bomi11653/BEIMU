import {
  partnerBrands,
  platformLinks,
  publicProfile,
} from "@/data/profile";
import { portfolioAssetPath } from "@/data/portfolioCategories";

type ProfileContactStageProps = {
  isActive: boolean;
};

export function ProfileContactStage({ isActive }: ProfileContactStageProps) {
  return (
    <section
      className="home-stage-layer profile-contact-stage"
      aria-hidden={!isActive}
      aria-labelledby="profile-contact-title"
      inert={!isActive ? true : undefined}
    >
      <div
        className="profile-contact-scroll"
        data-stage-scroll
        tabIndex={0}
        aria-label="个人介绍与联系方式"
      >
        <section className="partner-archive" aria-labelledby="partner-title">
          <header className="partner-archive-heading">
            <p>SELECTED PARTNERS · 01</p>
            <h2 id="partner-title">合作品牌</h2>
          </header>

          {partnerBrands.length > 0 ? (
            <ul className="partner-brand-list">
              {partnerBrands.map((brand) => (
                <li key={brand.id}>
                  {brand.href ? (
                    <a href={brand.href} target="_blank" rel="noreferrer">
                      {/* Logo files will be supplied from the personal workstation. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt={brand.name} />
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logo} alt={brand.name} />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="partner-archive-empty">
              <p>品牌资料将在个人电脑整理后接入</p>
              <span>此处只展示真实合作经历，当前保持留白。</span>
            </div>
          )}
        </section>

        <section className="profile-introduction" aria-labelledby="profile-contact-title">
          <figure className="profile-portrait-card">
            {/* Existing portrait is already sized for this editorial crop. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portfolioAssetPath(publicProfile.portrait)}
              alt={`${publicProfile.nameZh}个人肖像`}
            />
            <figcaption>
              <span>{publicProfile.nameEn}</span>
              <span>{publicProfile.title}</span>
            </figcaption>
          </figure>

          <div className="profile-introduction-copy">
            <p>ABOUT · 02</p>
            <h2 id="profile-contact-title">{publicProfile.statement}</h2>
            <p>{publicProfile.introduction}</p>

            <div className="profile-signature">
              <div>
                <strong>{publicProfile.nameZh}</strong>
                <span>{publicProfile.nameEn}</span>
              </div>
              <span>{publicProfile.location}</span>
            </div>

            <ul className="profile-disciplines" aria-label="专业方向">
              {publicProfile.disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="platform-directory" aria-labelledby="platform-title">
          <header className="platform-directory-heading">
            <p>CONTACT WINDOWS · 03</p>
            <h2 id="platform-title">找到我</h2>
          </header>

          <div className="platform-window-grid">
            {platformLinks.map((platform, index) => {
              const content = (
                <>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{platform.label}</strong>
                    <small>{platform.handle}</small>
                  </div>
                  <span aria-hidden="true">{platform.href ? "↗" : "—"}</span>
                </>
              );

              return platform.href ? (
                <a
                  className="platform-window"
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                  key={platform.id}
                >
                  {content}
                </a>
              ) : (
                <div
                  className="platform-window is-pending"
                  aria-label={`${platform.label}链接待补`}
                  key={platform.id}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
