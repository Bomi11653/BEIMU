"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  capabilities,
  type CapabilityId,
  type CapabilityMedia,
} from "@/data/capabilities";
import {
  SITE_NAV_EVENT,
  parseHomeStageQuery,
  type SiteNavEventDetail,
} from "@/data/siteNav";
import {
  useStageNavigation,
  type HomeStageIndex,
} from "@/hooks/useStageNavigation";
import { CapabilityCarouselDots } from "./CapabilityCarouselDots";
import { CategoryDirectory } from "./CategoryDirectory";
import { DownloadStage } from "./DownloadStage";
import { PortfolioStage } from "./PortfolioStage";
import { ProfileContactStage } from "./ProfileContactStage";

const AUTO_ADVANCE_MS = 8500;
const LAST_STAGE = 4 as HomeStageIndex;
const initialCapability = capabilities[0];

const STAGE_CUE: Record<
  HomeStageIndex,
  { index: string; label: string; aria: string; up?: boolean }
> = {
  0: {
    index: "02",
    label: "ABOUT",
    aria: "进入介绍",
  },
  1: {
    index: "03",
    label: "WORKS",
    aria: "进入作品目录",
  },
  2: {
    index: "04",
    label: "DOWNLOAD",
    aria: "进入下载",
  },
  3: {
    index: "05",
    label: "CONTACT",
    aria: "进入联系方式",
  },
  4: {
    index: "01",
    label: "HOME",
    aria: "返回首页",
    up: true,
  },
};

const STAGE_STATUS: Record<HomeStageIndex, string> = {
  0: "首页",
  1: "介绍",
  2: "作品目录",
  3: "下载",
  4: "联系",
};

export function HomeStage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeStage, setActiveStage] = useState<HomeStageIndex>(
    () => parseHomeStageQuery(searchParams.get("stage")) ?? 0,
  );
  const [activeId, setActiveId] = useState<CapabilityId>(initialCapability.id);
  const [activeMedia, setActiveMedia] = useState<CapabilityMedia>(
    initialCapability.media[0],
  );
  const rootRef = useRef<HTMLElement | null>(null);
  const syncingFromUrlRef = useRef(false);
  const urlReadyRef = useRef(false);
  const mediaCursorRef = useRef<Record<CapabilityId, number>>(
    Object.fromEntries(capabilities.map((item) => [item.id, 0])) as Record<
      CapabilityId,
      number
    >,
  );
  const userHasInteractedRef = useRef(false);
  const activeIdRef = useRef<CapabilityId>(initialCapability.id);

  const activateCapability = useCallback(
    (id: CapabilityId, initiatedByUser = true) => {
      if (initiatedByUser) {
        userHasInteractedRef.current = true;
      }

      if (activeIdRef.current === id) return;

      const capability = capabilities.find((item) => item.id === id);
      if (!capability) return;

      // Prefer first media for a category (stable), not rotating on every click —
      // rotation during rapid clicks caused extra load spikes.
      const nextMedia = capability.media[0];
      mediaCursorRef.current[id] = 0;

      activeIdRef.current = id;
      setActiveId(id);
      setActiveMedia(nextMedia);
    },
    [],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || userHasInteractedRef.current || activeStage !== 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (userHasInteractedRef.current || activeStage !== 0) return;

      const activeIndex = capabilities.findIndex((item) => item.id === activeId);
      const nextCapability = capabilities[(activeIndex + 1) % capabilities.length];
      activateCapability(nextCapability.id, false);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeId, activeStage, activateCapability]);

  const { direction, goToStage, isTransitioning } = useStageNavigation({
    activeStage,
    onStageChange: setActiveStage,
    targetRef: rootRef,
  });

  const applyNavTarget = useCallback((href: string) => {
    const url = new URL(href, window.location.origin);
    const stageFromUrl = parseHomeStageQuery(url.searchParams.get("stage"));

    syncingFromUrlRef.current = true;

    if (stageFromUrl !== null) {
      setActiveStage(stageFromUrl);
    } else if (url.pathname === "/" || url.pathname === "") {
      setActiveStage(0);
    }

    urlReadyRef.current = true;

    window.requestAnimationFrame(() => {
      syncingFromUrlRef.current = false;
    });
  }, []);

  useEffect(() => {
    const stageFromUrl = parseHomeStageQuery(searchParams.get("stage"));

    syncingFromUrlRef.current = true;

    if (stageFromUrl !== null) {
      setActiveStage(stageFromUrl);
    } else {
      setActiveStage(0);
    }

    urlReadyRef.current = true;

    const frame = window.requestAnimationFrame(() => {
      syncingFromUrlRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchParams]);

  useEffect(() => {
    const onSiteNav = (event: Event) => {
      const detail = (event as CustomEvent<SiteNavEventDetail>).detail;
      if (!detail?.href) return;
      applyNavTarget(detail.href);
    };

    window.addEventListener(SITE_NAV_EVENT, onSiteNav);
    return () => window.removeEventListener(SITE_NAV_EVENT, onSiteNav);
  }, [applyNavTarget]);

  useEffect(() => {
    if (!urlReadyRef.current || syncingFromUrlRef.current) return;

    const params = new URLSearchParams();
    params.set("stage", String(activeStage));

    const next = `/?${params.toString()}`;
    const currentQuery = window.location.search.replace(/^\?/, "");
    const nextQuery = params.toString();

    if (currentQuery !== nextQuery) {
      router.replace(next, { scroll: false });
    }
  }, [activeStage, router]);

  const nextStage = (
    activeStage === LAST_STAGE ? 0 : activeStage + 1
  ) as HomeStageIndex;
  const cue = STAGE_CUE[activeStage];
  const showCarousel = activeStage === 0;

  useEffect(() => {
    if (activeStage !== 0) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !(event.target instanceof HTMLElement) ||
        event.target.closest(
          "a, button, input, select, textarea, summary, [contenteditable='true']",
        )
      ) {
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const activeIndex = capabilities.findIndex((item) => item.id === activeId);
      if (activeIndex < 0) return;

      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next =
        capabilities[
          (activeIndex + delta + capabilities.length) % capabilities.length
        ];
      activateCapability(next.id, true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, activeStage, activateCapability]);

  return (
    <main
      id="main-content"
      ref={rootRef}
      className="home-stage"
      data-active-stage={activeStage}
      data-stage-direction={direction}
      data-stage-transitioning={isTransitioning ? "true" : "false"}
    >
      <p className="visually-hidden" aria-live="polite">
        {STAGE_STATUS[activeStage]}
      </p>
      <PortfolioStage media={activeMedia} isActive={activeStage === 0} />
      <ProfileContactStage
        mode="about"
        isActive={activeStage === 1}
        onGoToContact={() => goToStage(4)}
      />
      <CategoryDirectory
        isActive={activeStage === 2}
        activeCategoryId={activeId}
        onActivateCategory={activateCapability}
      />
      <DownloadStage isActive={activeStage === 3} />
      <ProfileContactStage mode="contact" isActive={activeStage === 4} />

      {showCarousel ? (
        <CapabilityCarouselDots
          items={capabilities}
          activeId={activeId}
          onActivate={activateCapability}
        />
      ) : null}

      <button
        className="stage-switch-cue"
        type="button"
        onClick={() => goToStage(nextStage)}
        disabled={isTransitioning}
        aria-label={cue.aria}
      >
        <span>{cue.index}</span>
        <span>{cue.label}</span>
        <span aria-hidden="true">{cue.up ? "↑" : "↓"}</span>
      </button>
    </main>
  );
}
