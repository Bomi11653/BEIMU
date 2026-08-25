"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  partnerBrands,
  platformLinks,
  publicProfile,
  type PlatformLink,
} from "@/data/profile";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { WeChatDialog } from "./WeChatDialog";

type ProfileContactStageProps = {
  isActive: boolean;
  onGoToWorks: () => void;
};

type ProfileSection = "about" | "contact";

function PlatformLinkItem({
  platform,
  onOpenWechat,
  wechatButtonRef,
}: {
  platform: PlatformLink;
  onOpenWechat: () => void;
  wechatButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const content = (
    <>
      <span className="contact-platform-logo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portfolioAssetPath(platform.logo)}
          alt=""
        />
      </span>
      <span
        className="contact-platform-label"
        lang={
          ["xiaohongshu", "wechat"].includes(platform.id) ? "zh-CN" : "en"
        }
      >
        {platform.label}
      </span>
    </>
  );

  if (platform.kind === "wechat") {
    return (
      <button
        ref={wechatButtonRef}
        className="contact-platform-link contact-platform-wechat"
        type="button"
        aria-haspopup="dialog"
        aria-label="打开 LEON 的微信二维码"
        onClick={onOpenWechat}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      className={`contact-platform-link contact-platform-${platform.id}`}
      href={platform.href}
      target={platform.kind === "external" ? "_blank" : undefined}
      rel={platform.kind === "external" ? "noreferrer" : undefined}
      aria-label={`${platform.kind === "email" ? "发送邮件至" : "打开"}${platform.label}：${platform.handle}`}
    >
      {content}
    </a>
  );
}

export function ProfileContactStage({
  isActive,
  onGoToWorks,
}: ProfileContactStageProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const wechatButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeSection, setActiveSection] = useState<ProfileSection>("about");
  const [isWechatOpen, setIsWechatOpen] = useState(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const contactElement = contactRef.current;

    if (!scrollElement || !contactElement) return;

    const updateSection = () => {
      const contactStart = contactElement.offsetTop - scrollElement.clientHeight * 0.42;
      setActiveSection(scrollElement.scrollTop >= contactStart ? "contact" : "about");
    };

    updateSection();
    scrollElement.addEventListener("scroll", updateSection, { passive: true });

    return () => scrollElement.removeEventListener("scroll", updateSection);
  }, []);

  const scrollTo = (target: HTMLElement | null) => {
    if (!target) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      className="home-stage-layer profile-contact-stage"
      aria-hidden={!isActive}
      aria-labelledby="profile-title"
      inert={!isActive ? true : undefined}
    >
      <div className="profile-page-meta profile-page-meta-left">
        BEIMU / {activeSection === "contact" ? "CONTACT" : "ABOUT"}
      </div>
      <div className="profile-page-meta profile-page-meta-right">
        2026 PORTFOLIO
      </div>

      <nav className="profile-section-nav" aria-label="个人作品集导航">
        <button type="button" onClick={onGoToWorks}>
          <span>01</span>
          <span>作品</span>
        </button>
        <button
          type="button"
          className={activeSection === "about" ? "is-active" : undefined}
          aria-current={activeSection === "about" ? "page" : undefined}
          onClick={() => scrollTo(aboutRef.current)}
        >
          <span>02</span>
          <span>关于我</span>
        </button>
        <button
          type="button"
          className={activeSection === "contact" ? "is-active" : undefined}
          aria-current={activeSection === "contact" ? "page" : undefined}
          onClick={() => scrollTo(contactRef.current)}
        >
          <span>03</span>
          <span>联系</span>
        </button>
      </nav>

      <div
        ref={scrollRef}
        className="profile-contact-scroll"
        data-stage-scroll
        tabIndex={0}
        aria-label="合作品牌、个人介绍与联系方式"
      >
        <section className="partner-archive" aria-labelledby="partner-title">
          <header className="partner-archive-heading">
            <p>SELECTED COLLABORATIONS · 01</p>
            <h2 id="partner-title">合作品牌</h2>
          </header>

          {partnerBrands.length > 0 ? (
            <ul className="partner-brand-list">
              {partnerBrands.map((brand) => (
                <li key={brand.id}>
                  {brand.href ? (
                    <a href={brand.href} target="_blank" rel="noreferrer">
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
            <div className="partner-archive-empty" aria-label="合作品牌位置已预留">
              <span>BRAND ARCHIVE</span>
              <span>真实合作品牌将在素材整理后显示</span>
            </div>
          )}
        </section>

        <section
          ref={aboutRef}
          className="profile-introduction"
          aria-labelledby="profile-title"
        >
          <header className="profile-identity-heading">
            <h2 id="profile-title">
              {publicProfile.nameEn} <span>{publicProfile.nameZh}</span>
            </h2>
            <p>
              {publicProfile.studioName} · {publicProfile.title}
            </p>
          </header>

          <div className="profile-introduction-grid">
            <aside className="profile-summary">
              <figure className="profile-portrait-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portfolioAssetPath(publicProfile.portrait)}
                  alt={`${publicProfile.nameZh}个人肖像`}
                />
              </figure>

              <div className="profile-summary-copy">
                <strong>{publicProfile.nameZh} / BEIMU</strong>
                <span>{publicProfile.disciplines.join(" · ")}</span>
                <span>BASE　{publicProfile.location}</span>
              </div>

              <button
                className="profile-contact-jump"
                type="button"
                onClick={() => scrollTo(contactRef.current)}
              >
                联系方式 / CONTACT
              </button>
            </aside>

            <div className="profile-biography">
              <p className="profile-edition">2026 CREATIVE PORTFOLIO</p>

              <div lang="zh-CN">
                {publicProfile.introductionZh.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div lang="en">
                {publicProfile.introductionEn.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={contactRef}
          className="platform-directory"
          aria-labelledby="platform-title"
        >
          <div className="contact-introduction">
            <p>CONTACT / 03</p>
            <span className="contact-introduction-rule" aria-hidden="true" />
            <h2 id="platform-title">START A CONVERSATION</h2>
            <p>有想法，就从这里开始。</p>

            <dl className="contact-meta-list">
              <div>
                <dt>AVAILABLE FOR</dt>
                <dd>3D 视觉设计 · AI 影像创作 · 动画与新媒体</dd>
              </div>
              <div>
                <dt>BASED IN</dt>
                <dd>东莞 · 中国</dd>
              </div>
              <div>
                <dt>TIMEZONE</dt>
                <dd>GMT+8</dd>
              </div>
              <div>
                <dt>RESPONSE TIME</dt>
                <dd>Within 24–48 Hours</dd>
              </div>
            </dl>
          </div>

          <div className="contact-platform-canvas">
            {platformLinks.map((platform) => (
              <PlatformLinkItem
                platform={platform}
                onOpenWechat={() => setIsWechatOpen(true)}
                wechatButtonRef={wechatButtonRef}
                key={platform.id}
              />
            ))}
          </div>
        </section>
      </div>

      <WeChatDialog
        isOpen={isWechatOpen && isActive}
        onClose={() => setIsWechatOpen(false)}
        returnFocusRef={wechatButtonRef}
      />
    </section>
  );
}
