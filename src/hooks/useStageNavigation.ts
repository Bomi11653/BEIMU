"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type HomeStageIndex = 0 | 1 | 2;
export type StageDirection = "forward" | "backward";

const WHEEL_THRESHOLD = 48;
const TOUCH_THRESHOLD = 48;
const TRANSITION_LOCK_MS = 900;
const REDUCED_MOTION_LOCK_MS = 180;
const LAST_STAGE: HomeStageIndex = 2;

type UseStageNavigationOptions = {
  activeStage: HomeStageIndex;
  onStageChange: (stage: HomeStageIndex) => void;
  targetRef: RefObject<HTMLElement | null>;
};

const isInteractiveTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.closest(
      "a, button, input, select, textarea, summary, [contenteditable='true'], [role='button'], [role='radio']",
    ),
  );
};

const normalizeWheelDelta = (event: WheelEvent) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
};

const getStageScrollContainer = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return null;

  return target.closest<HTMLElement>("[data-stage-scroll]");
};

const canScrollInDirection = (element: HTMLElement, delta: number) => {
  const maxScroll = element.scrollHeight - element.clientHeight;

  if (maxScroll <= 1) return false;
  if (delta > 0) return element.scrollTop < maxScroll - 1;
  if (delta < 0) return element.scrollTop > 1;

  return false;
};

export function useStageNavigation({
  activeStage,
  onStageChange,
  targetRef,
}: UseStageNavigationOptions) {
  const [direction, setDirection] = useState<StageDirection>("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wheelDeltaRef = useRef(0);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    scrollContainer: HTMLElement | null;
  } | null>(null);
  const lockUntilRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);

  const goToStage = useCallback(
    (nextStage: HomeStageIndex) => {
      if (nextStage === activeStage || performance.now() < lockUntilRef.current) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lockDuration = reducedMotion
        ? REDUCED_MOTION_LOCK_MS
        : TRANSITION_LOCK_MS;

      setDirection(nextStage > activeStage ? "forward" : "backward");
      setIsTransitioning(true);
      wheelDeltaRef.current = 0;
      lockUntilRef.current = performance.now() + lockDuration;
      onStageChange(nextStage);

      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }

      unlockTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        unlockTimerRef.current = null;
      }, lockDuration);
    },
    [activeStage, onStageChange],
  );

  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const delta = normalizeWheelDelta(event);
      const scrollContainer = getStageScrollContainer(event.target);

      if (scrollContainer && canScrollInDirection(scrollContainer, delta)) {
        wheelDeltaRef.current = 0;
        return;
      }

      if (Math.sign(delta) !== Math.sign(wheelDeltaRef.current)) {
        wheelDeltaRef.current = 0;
      }

      wheelDeltaRef.current += delta;

      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) {
        return;
      }

      const nextStage = Math.min(
        LAST_STAGE,
        Math.max(0, activeStage + (wheelDeltaRef.current > 0 ? 1 : -1)),
      ) as HomeStageIndex;

      goToStage(nextStage);
      wheelDeltaRef.current = 0;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        scrollContainer: getStageScrollContainer(event.target),
      };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;

      if (!start || !touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (
        Math.abs(deltaY) < TOUCH_THRESHOLD ||
        Math.abs(deltaY) <= Math.abs(deltaX)
      ) {
        return;
      }

      const scrollDelta = -deltaY;

      if (
        start.scrollContainer &&
        canScrollInDirection(start.scrollContainer, scrollDelta)
      ) {
        return;
      }

      const nextStage = Math.min(
        LAST_STAGE,
        Math.max(0, activeStage + (deltaY < 0 ? 1 : -1)),
      ) as HomeStageIndex;

      goToStage(nextStage);
    };

    const resetTouch = () => {
      touchStartRef.current = null;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInteractiveTarget(event.target)
      ) {
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goToStage(LAST_STAGE);
      }

      if (["ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        goToStage(Math.min(LAST_STAGE, activeStage + 1) as HomeStageIndex);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToStage(0);
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToStage(Math.max(0, activeStage - 1) as HomeStageIndex);
      }
    };

    target.addEventListener("wheel", handleWheel, { passive: true });
    target.addEventListener("touchstart", handleTouchStart, { passive: true });
    target.addEventListener("touchend", handleTouchEnd, { passive: true });
    target.addEventListener("touchcancel", resetTouch, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      target.removeEventListener("wheel", handleWheel);
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchend", handleTouchEnd);
      target.removeEventListener("touchcancel", resetTouch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStage, goToStage, targetRef]);

  useEffect(
    () => () => {
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    },
    [],
  );

  return { direction, goToStage, isTransitioning };
}
