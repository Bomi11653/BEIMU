"use client";

import { useRef, useState, type RefObject } from "react";
import {
  partnerBrands,
  platformLinks,
  publicProfile,
  type PlatformLink,
} from "@/data/profile";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { WeChatDialog } from "./WeChatDialog";

export type ProfileStageMode = "about" | "contact";

type ProfileContactStageProps = {
  isActive: boolean;
  mode: ProfileStageMode;
  onGoToContact?: () => void;
};

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
        <img src={portfolioAssetPath(platform.logo)} alt="" />
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
  mode,
  onGoToContact,
}: ProfileContactStageProps) {
  const wechatButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isWechatOpen, setIsWechatOpen] = useState(false);
  const isAbout = mode === "about";

  return (
    <section
      className={`home-stage-layer profile-contact-stage is-${mode}`}
      aria-hidden={!isActive}
      aria-labelledby={isAbout ? "profile-title" : "platform-title"}
      inert={!isActive ? true : undefined}
    >
      <div className="profile-page-meta profile-page-meta-left">
        {isAbout ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="profile-page-meta-signature"
            src={portfolioAssetPath(brandAssets.signatureWhite)}
            alt="BEIMU · LEON BEIMU STUDIO"
            width={160}
            height={48}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="profile-page-meta-wordmark"
            src={portfolioAssetPath(brandAssets.wordmarkWhite)}
            alt="BEIMU"
            width={100}
            height={24}
          />
        )}
      </div>
      <div className="profile-page-meta profile-page-meta-right">
        {isAbout ? "ABOUT · 02" : "CONTACT · 05"}
      </div>

      <div
        className="profile-contact-scroll"
        data-stage-scroll
        tabIndex={0}
        aria-label={
          isAbout ? "合作品牌与个人介绍" : "联系方式与平台入口"
        }
      >
        {isAbout ? (
          <>
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
                <div
                  className="partner-archive-empty"
                  aria-label="合作品牌位置已预留"
                >
                  <span>BRAND ARCHIVE</span>
                  <span>真实合作品牌将在素材整理后显示</span>
                </div>
              )}
            </section>

            <section
              id="profile-about"
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

                  {onGoToContact ? (
                    <button
                      className="profile-contact-jump"
                      type="button"
                      onClick={onGoToContact}
                    >
                      联系方式 / CONTACT
                    </button>
                  ) : null}
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
          </>
        ) : (
          <section
            id="profile-contact"
            className="platform-directory"
            aria-labelledby="platform-title"
          >
            <div className="contact-introduction">
              <p>CONTACT</p>
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
        )}
      </div>

      {!isAbout ? (
        <WeChatDialog
          isOpen={isWechatOpen && isActive}
          onClose={() => setIsWechatOpen(false)}
          returnFocusRef={wechatButtonRef}
        />
      ) : null}
    </section>
  );
}
