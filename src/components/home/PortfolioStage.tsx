"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  capabilities,
  type CapabilityId,
  type CapabilityMedia,
} from "@/data/capabilities";
import { BackgroundMedia } from "./BackgroundMedia";
import { CapabilityNav } from "./CapabilityNav";
import { IdentityBlock } from "./IdentityBlock";

const AUTO_ADVANCE_MS = 8500;
const initialCapability = capabilities[0];

export function PortfolioStage() {
  const [activeId, setActiveId] = useState<CapabilityId>(initialCapability.id);
  const [activeMedia, setActiveMedia] = useState<CapabilityMedia>(
    initialCapability.media[0],
  );
  const mediaCursorRef = useRef<Record<CapabilityId, number>>({
    "3d": 0,
    ai: 0,
    media: 0,
  });
  const userHasInteractedRef = useRef(false);

  const activateCapability = useCallback(
    (id: CapabilityId, initiatedByUser = true) => {
      if (initiatedByUser) {
        userHasInteractedRef.current = true;
      }

      setActiveId((currentId) => {
        if (currentId === id) {
          return currentId;
        }

        const capability = capabilities.find((item) => item.id === id);

        if (!capability) {
          return currentId;
        }

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
      if (userHasInteractedRef.current) {
        return;
      }

      const activeIndex = capabilities.findIndex((item) => item.id === activeId);
      const nextCapability = capabilities[(activeIndex + 1) % capabilities.length];
      activateCapability(nextCapability.id, false);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeId, activateCapability]);

  return (
    <main className="portfolio-stage">
      <BackgroundMedia media={activeMedia} />

      <div className="stage-content">
        <CapabilityNav
          items={capabilities}
          activeId={activeId}
          onActivate={activateCapability}
        />

        <IdentityBlock />

        <p className="portfolio-year">PORTFOLIO 2026</p>
        <p className="location-label">DONGGUAN · CHINA</p>
      </div>
    </main>
  );
}
