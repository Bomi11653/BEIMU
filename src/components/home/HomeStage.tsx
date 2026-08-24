"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  capabilities,
  type CapabilityId,
  type CapabilityMedia,
} from "@/data/capabilities";
import {
  useStageNavigation,
  type HomeStageIndex,
} from "@/hooks/useStageNavigation";
import { CategoryDirectory } from "./CategoryDirectory";
import { EdgeRevealNav } from "./EdgeRevealNav";
import { PortfolioStage } from "./PortfolioStage";
import { ProfileContactStage } from "./ProfileContactStage";

const AUTO_ADVANCE_MS = 8500;
const initialCapability = capabilities[0];

export function HomeStage() {
  const [activeStage, setActiveStage] = useState<HomeStageIndex>(0);
  const [activeId, setActiveId] = useState<CapabilityId>(initialCapability.id);
  const [activeMedia, setActiveMedia] = useState<CapabilityMedia>(
    initialCapability.media[0],
  );
  const rootRef = useRef<HTMLElement | null>(null);
  const mediaCursorRef = useRef<Record<CapabilityId, number>>(
    Object.fromEntries(capabilities.map((item) => [item.id, 0])) as Record<
      CapabilityId,
      number
    >,
  );
  const userHasInteractedRef = useRef(false);

  const activateCapability = useCallback(
    (id: CapabilityId, initiatedByUser = true) => {
      if (initiatedByUser) {
        userHasInteractedRef.current = true;
      }

      setActiveId((currentId) => {
        if (currentId === id) return currentId;

        const capability = capabilities.find((item) => item.id === id);

        if (!capability) return currentId;

        const mediaIndex = mediaCursorRef.current[id] % capability.media.length;
        const nextMedia = capability.media[mediaIndex];
        mediaCursorRef.current[id] = (mediaIndex + 1) % capability.media.length;
        setActiveMedia(nextMedia);

        return id;
      });
    },
    [],
  );

  useEffect(() => {
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

  const nextStage = (activeStage === 2 ? 0 : activeStage + 1) as HomeStageIndex;

  return (
    <main
      id="main-content"
      ref={rootRef}
      className="home-stage"
      data-active-stage={activeStage}
      data-stage-direction={direction}
      data-stage-transitioning={isTransitioning ? "true" : "false"}
    >
      <PortfolioStage media={activeMedia} isActive={activeStage === 0} />
      <CategoryDirectory
        isActive={activeStage === 1}
        activeCategoryId={activeId}
        onActivateCategory={activateCapability}
      />
      <ProfileContactStage
        isActive={activeStage === 2}
        onGoToWorks={() => goToStage(1)}
      />

      {activeStage !== 2 && (
        <EdgeRevealNav
          items={capabilities}
          activeId={activeId}
          onActivate={activateCapability}
          compact={activeStage !== 0}
        />
      )}

      <button
        className="stage-switch-cue"
        type="button"
        onClick={() => goToStage(nextStage)}
        disabled={isTransitioning}
        aria-label={
          activeStage === 0
            ? "进入作品目录"
            : activeStage === 1
              ? "进入个人介绍与联系方式"
              : "返回首页介绍"
        }
      >
        <span>{activeStage === 0 ? "02" : activeStage === 1 ? "03" : "01"}</span>
        <span>
          {activeStage === 0
            ? "SCROLL TO EXPLORE"
            : activeStage === 1
              ? "ABOUT & CONTACT"
              : "BACK TO INTRO"}
        </span>
        <span aria-hidden="true">{activeStage === 2 ? "↑" : "↓"}</span>
      </button>
    </main>
  );
}
