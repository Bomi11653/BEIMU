"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  CREDENTIAL_SLOT_COUNT,
  partnerBrands,
  platformLinks,
  profileCredentials,
  profileDirectContacts,
  publicProfile,
  type PlatformLink,
  type ProfileLang,
} from "@/data/profile";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { AboutLanguageShutter } from "./AboutLanguageShutter";
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
          ["xiaohongshu", "wechat", "qq"].includes(platform.id)
            ? "zh-CN"
            : "en"
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
        aria-label="打开 Affectionwood 的微信二维码"
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
  const [aboutLang, setAboutLang] = useState<ProfileLang>("zh");
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);
  const copyResetTimerRef = useRef<number | null>(null);

  const copyContactHandle = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    setCopiedContactId(id);
    if (copyResetTimerRef.current != null) {
      window.clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopiedContactId(null);
      copyResetTimerRef.current = null;
    }, 1600);
  };

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current != null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);
  const isAbout = mode === "about";
  const bioBlocks =
    aboutLang === "zh"
      ? publicProfile.introductionZh
      : publicProfile.introductionEn;
  const credentialSlots = Array.from(
    { length: Math.max(CREDENTIAL_SLOT_COUNT, profileCredentials.length) },
    (_, index) => profileCredentials[index] ?? null,
  );

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
                  {partnerBrands.map((brand) => {
                    const scaleStyle =
                      brand.scale != null
                        ? ({
                            ["--partner-mark-scale" as string]: String(
                              brand.scale,
                            ),
                          } as CSSProperties)
                        : undefined;

                    const mark = brand.motion ? (
                      <span
                        className="partner-brand-mark partner-brand-mark--motion"
                        style={scaleStyle}
                      >
                        <video
                          className="partner-brand-motion"
                          poster={portfolioAssetPath(brand.logo)}
                          autoPlay
                          muted
                          loop
                          playsInline
                          aria-label={brand.name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback =
                              event.currentTarget.nextElementSibling;
                            if (fallback instanceof HTMLElement) {
                              fallback.style.opacity = "1";
                            }
                          }}
                        >
                          <source
                            src={portfolioAssetPath(brand.motion)}
                            type="video/webm"
                          />
                        </video>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="partner-brand-fallback"
                          src={portfolioAssetPath(brand.logo)}
                          alt=""
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="partner-brand-mark"
                        style={scaleStyle}
                        src={portfolioAssetPath(brand.logo)}
                        alt={brand.name}
                      />
                    );

                    return (
                      <li key={brand.id} data-partner={brand.id}>
                        {brand.href ? (
                          <a href={brand.href} target="_blank" rel="noreferrer">
                            {mark}
                          </a>
                        ) : (
                          mark
                        )}
                      </li>
                    );
                  })}
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
                  {publicProfile.nameZh} <span>/ {publicProfile.alias}</span>
                </h2>
                <p>{publicProfile.title}</p>
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
                    <strong>
                      {publicProfile.nameZh} / {publicProfile.alias}
                    </strong>
                    <span>{publicProfile.disciplines.join(" · ")}</span>
                    <span>BASE　{publicProfile.location}</span>
                  </div>

                  <div className="profile-aside-contact">
                    <p className="profile-aside-contact-label">
                      联系方式 / CONTACT
                    </p>
                    <ul className="profile-aside-contact-list">
                      {profileDirectContacts.map((channel) => {
                        const isCopied = copiedContactId === channel.id;
                        return (
                          <li key={channel.id}>
                            <button
                              ref={
                                channel.kind === "wechat"
                                  ? wechatButtonRef
                                  : undefined
                              }
                              className={`profile-aside-contact-item${isCopied ? " is-copied" : ""}`}
                              type="button"
                              aria-label={`复制${channel.label}：${channel.handle}`}
                              onClick={() =>
                                void copyContactHandle(
                                  channel.id,
                                  channel.handle,
                                )
                              }
                            >
                              <span>{channel.label}</span>
                              <strong>{channel.handle}</strong>
                              <em aria-live="polite">
                                {isCopied ? "已复制" : "点击复制"}
                              </em>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {onGoToContact ? (
                      <button
                        className="profile-contact-jump"
                        type="button"
                        onClick={onGoToContact}
                      >
                        全部平台入口 →
                      </button>
                    ) : null}
                  </div>
                </aside>

                <div className="profile-biography">
                  <div className="profile-biography-toolbar">
                    <AboutLanguageShutter
                      lang={aboutLang}
                      onLangChange={setAboutLang}
                    />
                    <p className="profile-edition">
                      {publicProfile.studioName} / {publicProfile.studioNameZh}
                    </p>
                  </div>

                  <div
                    lang={aboutLang === "zh" ? "zh-CN" : "en"}
                    className="profile-bio-lang"
                    aria-live="polite"
                  >
                    {bioBlocks.map((block) => (
                      <div
                        className="profile-bio-block"
                        key={`${aboutLang}-${block.kicker ?? block.paragraphs[0]}`}
                      >
                        {block.kicker ? (
                          <p className="profile-bio-kicker">{block.kicker}</p>
                        ) : null}
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ))}
                  </div>

                  <section
                    className="profile-credentials"
                    aria-labelledby="credentials-title"
                  >
                    <header className="profile-credentials-heading">
                      <p>CREDENTIALS</p>
                      <h3 id="credentials-title">专业认证</h3>
                    </header>

                    <ul className="profile-credentials-list">
                      {credentialSlots.map((item, index) => (
                        <li
                          key={item?.id ?? `credential-slot-${index}`}
                          className={
                            item
                              ? "profile-credential-card"
                              : "profile-credential-card is-empty"
                          }
                        >
                          {item ? (
                            <>
                              <p className="profile-credential-index">
                                {String(index + 1).padStart(2, "0")}
                              </p>
                              <div>
                                <strong>
                                  {aboutLang === "zh"
                                    ? item.titleZh
                                    : item.titleEn}
                                </strong>
                                <span>
                                  {aboutLang === "zh"
                                    ? item.issuerZh
                                    : item.issuerEn}
                                  {item.year ? ` · ${item.year}` : ""}
                                </span>
                              </div>
                              {item.verifyUrl ? (
                                <a
                                  href={item.verifyUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  VERIFY ↗
                                </a>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <p className="profile-credential-index">
                                {String(index + 1).padStart(2, "0")}
                              </p>
                              <div>
                                <strong>RESERVED</strong>
                                <span>证书整理后显示</span>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>

                    <p className="profile-credentials-more" aria-disabled="true">
                      VIEW ALL CREDENTIALS
                    </p>
                  </section>
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

      <WeChatDialog
        isOpen={isWechatOpen && isActive}
        onClose={() => setIsWechatOpen(false)}
        returnFocusRef={wechatButtonRef}
      />
    </section>
  );
}
