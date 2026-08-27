"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RouteTransitionPhase = "off" | "closing" | "closed" | "opening";

export type RouteTransitionCopy = {
  title: string;
  meta: string;
  eyebrow?: string;
};

type RouteTransitionContextValue = {
  isTransitioning: boolean;
  startRouteTransition: (href: string, copy: RouteTransitionCopy) => void;
};

const CLOSE_DURATION = 620;
const HOLD_DURATION = 420;
const OPEN_DURATION = 780;

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(
  null,
);

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<RouteTransitionPhase>("off");
  const [copy, setCopy] = useState<RouteTransitionCopy | null>(null);
  const timers = useRef<number[]>([]);
  const transitionLock = useRef(false);
  const transitionLocked = phase !== "off";

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (phase !== "off") return;

    const routeTarget = document.querySelector<HTMLElement>("[data-route-focus]");
    routeTarget?.focus({ preventScroll: true });
  }, [pathname, phase]);

  const startRouteTransition = useCallback(
    (href: string, nextCopy: RouteTransitionCopy) => {
      if (transitionLock.current || href === pathname) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      clearTimers();
      transitionLock.current = true;
      setCopy(nextCopy);
      setPhase("closing");

      timers.current.push(
        window.setTimeout(() => {
          setPhase("closed");
          router.push(href);

          timers.current.push(
            window.setTimeout(() => {
              setPhase("opening");

              timers.current.push(
                window.setTimeout(() => {
                  setPhase("off");
                  setCopy(null);
                  transitionLock.current = false;
                }, OPEN_DURATION),
              );
            }, HOLD_DURATION),
          );
        }, CLOSE_DURATION),
      );
    },
    [clearTimers, pathname, router],
  );

  return (
    <RouteTransitionContext.Provider
      value={{ isTransitioning: transitionLocked, startRouteTransition }}
    >
      {children}

      <div
        className={`route-transition-overlay is-${phase}`}
        aria-hidden={phase === "off"}
        aria-live="polite"
      >
        <div className="route-transition-panel route-transition-panel-top" />
        <div className="route-transition-panel route-transition-panel-bottom" />

        <div className="route-transition-copy">
          <p>{copy?.eyebrow ?? "OPENING PROJECT"}</p>
          <h2>{copy?.title}</h2>
          <span>{copy?.meta}</span>
          <i aria-hidden="true" />
        </div>
      </div>
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error(
      "useRouteTransition must be used within RouteTransitionProvider",
    );
  }

  return context;
}
