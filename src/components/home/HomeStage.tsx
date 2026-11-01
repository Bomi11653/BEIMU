"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { PortfolioStage } from "./PortfolioStage";
import { ProfileContactStage } from "./ProfileContactStage";

const AUTO_ADVANCE_MS = 8500;
const LAST_STAGE = 4 as HomeStageIndex;
const initialCapability = capabilities[0];
// All devices now share continuous scrolling; keep section state for nav only.
const mobileQuery = "(min-width: 0px)";
const subscribeMobile = (notify: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const mobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const normalizeStage = (stage: HomeStageIndex): HomeStageIndex => stage === 1 ? 4 : stage === 3 ? 4 : stage;

const STAGE_CUE: Record<
  HomeStageIndex,
  { index: string; label: string; aria: string; up?: boolean }
> = {
  0: {
    index: "02",
    label: "WORKS",
    aria: "进入案例展示",
  },
  1: {
    index: "03",
    label: "WORKS",
    aria: "进入作品目录",
  },
  2: {
    index: "03",
    label: "ABOUT & CONTACT",
    aria: "进入关于与联系",
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
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStage = normalizeStage(parseHomeStageQuery(searchParams.get("stage")) ?? 0);
  const [activeStage, setActiveStage] = useState<HomeStageIndex>(
    () => initialStage,
  );
  const [activeId, setActiveId] = useState<CapabilityId>(initialCapability.id);
  const [activeMedia, setActiveMedia] = useState<CapabilityMedia>(
    initialCapability.media[0],
  );
  const [brandIntroActive, setBrandIntroActive] = useState(
    () => initialStage === 0,
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
  const activeIdRef = useRef<CapabilityId>(initialCapability.id);

  const activateCapability = useCallback(
    (id: CapabilityId) => {
      if (activeIdRef.current === id) return;

      const capability = capabilities.find((item) => item.id === id);
      if (!capability) return;

      const nextMedia = capability.media[0];
      mediaCursorRef.current[id] = 0;

      activeIdRef.current = id;
      setActiveId(id);
      setActiveMedia(nextMedia);
    },
    [],
  );

  const advanceToNextCapability = useCallback(() => {
    const activeIndex = capabilities.findIndex(
      (item) => item.id === activeIdRef.current,
    );
    if (activeIndex < 0) return;

    const nextCapability =
      capabilities[(activeIndex + 1) % capabilities.length];
    activateCapability(nextCapability.id);
  }, [activateCapability]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      reducedMotion ||
      activeStage !== 0 ||
      brandIntroActive
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (activeStage !== 0 || brandIntroActive) return;
      advanceToNextCapability();
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeId, activeStage, advanceToNextCapability, brandIntroActive]);

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
      setActiveStage(normalizeStage(stageFromUrl));
      if (window.matchMedia(mobileQuery).matches) {
        rootRef.current?.querySelector<HTMLElement>(`[data-home-section="${normalizeStage(stageFromUrl)}"]`)?.scrollIntoView({ block: "start" });
      }
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
      setActiveStage(normalizeStage(stageFromUrl));
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
    activeStage === LAST_STAGE ? 0 : activeStage === 0 ? 2 : 4
  ) as HomeStageIndex;
  const cue = STAGE_CUE[activeStage];
  const showCarousel = activeStage === 0;

  useEffect(() => {
    if (!mobile || !rootRef.current) return;
    const root = rootRef.current;
    const initial = normalizeStage(parseHomeStageQuery(window.location.search ? new URLSearchParams(window.location.search).get("stage") : null) ?? 0);
    root.querySelector<HTMLElement>(`[data-home-section="${initial}"]`)?.scrollIntoView({ block: "start" });
    const update = () => {
      const sections = [...root.querySelectorAll<HTMLElement>("[data-home-section]")];
      const line = root.scrollTop + root.clientHeight * .35;
      const section = sections.filter(item => item.offsetTop <= line).at(-1);
      if (section) setActiveStage(Number(section.dataset.homeSection) as HomeStageIndex);
    };
    root.addEventListener("scroll", update, { passive: true });
    return () => root.removeEventListener("scroll", update);
  }, [mobile]);

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
      activateCapability(next.id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, activeStage, activateCapability]);

  useEffect(() => {
    if (brandIntroActive) {
      document.body.dataset.brandIntro = "playing";
      return () => {
        delete document.body.dataset.brandIntro;
      };
    }

    delete document.body.dataset.brandIntro;
  }, [brandIntroActive]);

  return (
    <main
      id="main-content"
      ref={rootRef}
      className="home-stage"
      data-active-stage={activeStage}
      data-stage-direction={direction}
      data-stage-transitioning={isTransitioning ? "true" : "false"}
      data-brand-intro={brandIntroActive ? "playing" : "done"}
      data-home-layout="three"
    >
      <p className="visually-hidden" aria-live="polite">
        {STAGE_STATUS[activeStage]}
      </p>
      <div className="home-section home-section-hero" data-home-section="0">
      <PortfolioStage
        media={activeMedia}
        isActive={activeStage === 0}
        onIntroActiveChange={setBrandIntroActive}
        onBackgroundClick={advanceToNextCapability}
      />
      </div>
      <div className="home-section home-section-works" data-home-section="2">
      <CategoryDirectory
        isActive={mobile || activeStage === 2}
      />
      </div>
      <div className="home-section home-section-about" data-home-section="4">
      <ProfileContactStage mode="combined" isActive={mobile || activeStage === 4} />
      </div>

      {showCarousel && !brandIntroActive ? (
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
