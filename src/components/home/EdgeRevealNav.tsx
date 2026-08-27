"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import type { Capability, CapabilityId } from "@/data/capabilities";
import { CapabilityNav } from "./CapabilityNav";

const COLLAPSE_DELAY_MS = 600;
const NAV_ID = "portfolio-capability-nav";

type EdgeRevealNavProps = {
  items: Capability[];
  activeId: CapabilityId;
  onActivate: (id: CapabilityId) => void;
  compact?: boolean;
};

export function EdgeRevealNav({
  items,
  activeId,
  onActivate,
  compact = false,
}: EdgeRevealNavProps) {
  const [revealed, setRevealed] = useState(!compact);
  const collapseTimerRef = useRef<number | null>(null);
  const focusWithinRef = useRef(false);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current === null) return;
    window.clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = null;
  }, []);

  const reveal = useCallback(() => {
    if (!compact) return;
    clearCollapseTimer();
    setRevealed(true);
  }, [clearCollapseTimer, compact]);

  const scheduleCollapse = useCallback(() => {
    if (!compact) return;
    clearCollapseTimer();
    collapseTimerRef.current = window.setTimeout(() => {
      if (!focusWithinRef.current) {
        setRevealed(false);
      }
    }, COLLAPSE_DELAY_MS);
  }, [clearCollapseTimer, compact]);

  useEffect(() => clearCollapseTimer, [clearCollapseTimer]);

  const isRevealed = !compact || revealed;

  useEffect(() => {
    clearCollapseTimer();
    focusWithinRef.current = false;

    const frame = window.requestAnimationFrame(() => {
      setRevealed(!compact);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clearCollapseTimer, compact]);

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") reveal();
  };

  const handleFocus = () => {
    focusWithinRef.current = true;
    reveal();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    focusWithinRef.current = false;
    scheduleCollapse();
  };

  const toggleReveal = () => {
    clearCollapseTimer();
    setRevealed((current) => !current);
  };

  return (
    <div
      className={`edge-reveal-nav is-bottom${compact ? " is-compact" : ""}${
        isRevealed ? " is-revealed" : ""
      }`}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {compact && (
        <div
          className="edge-reveal-nav-sensor"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={scheduleCollapse}
          aria-hidden="true"
        />
      )}

      <div
        className="edge-reveal-nav-panel"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={scheduleCollapse}
      >
        <CapabilityNav
          id={NAV_ID}
          items={items}
          activeId={activeId}
          onActivate={onActivate}
        />
      </div>

      {compact && (
        <button
          className="edge-reveal-nav-handle"
          type="button"
          aria-controls={NAV_ID}
          aria-expanded={isRevealed}
          aria-label={isRevealed ? "收起作品分类导航" : "展开作品分类导航"}
          onClick={toggleReveal}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={scheduleCollapse}
        >
          <span aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
