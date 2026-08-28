"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brandAssets } from "@/data/brand";
import type { ProfileLang } from "@/data/profile";
import { portfolioAssetPath } from "@/data/portfolioCategories";

type ShutterPhase = "off" | "closing" | "closed" | "opening";

const CLOSE_DURATION = 620;
const HOLD_DURATION = 420;
const OPEN_DURATION = 780;

type AboutLanguageShutterProps = {
  lang: ProfileLang;
  onLangChange: (lang: ProfileLang) => void;
};

export function AboutLanguageShutter({
  lang,
  onLangChange,
}: AboutLanguageShutterProps) {
  const [phase, setPhase] = useState<ShutterPhase>("off");
  const [copy, setCopy] = useState<{
    title: string;
    description: string;
    meta: string;
  } | null>(null);
  const pendingLang = useRef<ProfileLang | null>(null);
  const timers = useRef<number[]>([]);
  const lock = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const switchTo = useCallback(
    (next: ProfileLang) => {
      if (next === lang || lock.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onLangChange(next);
        return;
      }

      clearTimers();
      lock.current = true;
      pendingLang.current = next;
      setCopy({
        title: next === "en" ? "ENGLISH" : "中文",
        description:
          next === "en"
            ? "Switching introduction to English."
            : "切换介绍文案为中文。",
        meta: next === "en" ? "ZH → EN" : "EN → ZH",
      });
      setPhase("closing");

      timers.current.push(
        window.setTimeout(() => {
          const target = pendingLang.current;
          if (target) onLangChange(target);
          setPhase("closed");

          timers.current.push(
            window.setTimeout(() => {
              setPhase("opening");

              timers.current.push(
                window.setTimeout(() => {
                  setPhase("off");
                  setCopy(null);
                  pendingLang.current = null;
                  lock.current = false;
                }, OPEN_DURATION),
              );
            }, HOLD_DURATION),
          );
        }, CLOSE_DURATION),
      );
    },
    [clearTimers, lang, onLangChange],
  );

  const isBusy = phase !== "off";

  return (
    <>
      <div
        className="about-lang-toggle"
        role="group"
        aria-label="Introduction language"
      >
        <button
          type="button"
          className={
            lang === "zh"
              ? "about-lang-toggle-btn is-active"
              : "about-lang-toggle-btn"
          }
          aria-pressed={lang === "zh"}
          disabled={isBusy}
          onClick={() => switchTo("zh")}
        >
          ZH
        </button>
        <span className="about-lang-toggle-rule" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          className={
            lang === "en"
              ? "about-lang-toggle-btn is-active"
              : "about-lang-toggle-btn"
          }
          aria-pressed={lang === "en"}
          disabled={isBusy}
          onClick={() => switchTo("en")}
        >
          EN
        </button>
      </div>

      <div
        className={`route-transition-overlay about-lang-shutter is-${phase}`}
        aria-hidden={phase === "off"}
        aria-live="polite"
      >
        <div className="route-transition-panel route-transition-panel-top" />
        <div className="route-transition-panel route-transition-panel-bottom" />
        <div className="route-transition-copy">
          <img
            className="route-transition-brand"
            src={portfolioAssetPath(brandAssets.wordmarkWhite)}
            alt="BEIMU"
          />
          <div className="route-transition-destination">
            <h2>{copy?.title ?? ""}</h2>
            {copy?.description ? <p>{copy.description}</p> : null}
            {copy?.meta ? <span>{copy.meta}</span> : null}
          </div>
          <i aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
