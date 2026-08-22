"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
} from "react";
import {
  portfolioCategories,
  type PortfolioCategoryId,
} from "@/data/portfolioCategories";
import { CategoryCard } from "./CategoryCard";

const MOBILE_LAYOUT_QUERY = "(max-width: 760px), (hover: none)";

const subscribeToMobileLayout = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_LAYOUT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const getMobileLayoutSnapshot = () =>
  window.matchMedia(MOBILE_LAYOUT_QUERY).matches;

const getServerMobileLayoutSnapshot = () => false;

type CategoryDirectoryProps = {
  isActive: boolean;
  activeCategoryId: PortfolioCategoryId;
  onActivateCategory: (id: PortfolioCategoryId) => void;
};

export function CategoryDirectory({
  isActive,
  activeCategoryId,
  onActivateCategory,
}: CategoryDirectoryProps) {
  const [isInteractionActive, setIsInteractionActive] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<PortfolioCategoryId, HTMLAnchorElement>());
  const intersectionRatiosRef = useRef(new Map<PortfolioCategoryId, number>());
  const isMobileLayout = useSyncExternalStore(
    subscribeToMobileLayout,
    getMobileLayoutSnapshot,
    getServerMobileLayoutSnapshot,
  );

  const activeSlot = portfolioCategories.findIndex(
    (category) => category.id === activeCategoryId,
  );
  const gridActiveSlot = isInteractionActive && !isMobileLayout
    ? String(activeSlot)
    : "none";

  const registerCard = useCallback(
    (id: PortfolioCategoryId, node: HTMLAnchorElement | null) => {
      if (node) {
        cardRefs.current.set(id, node);
      } else {
        cardRefs.current.delete(id);
      }
    },
    [],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !isMobileLayout) return;

    const intersectionRatios = intersectionRatiosRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute(
            "data-category-id",
          ) as PortfolioCategoryId | null;

          if (id) {
            intersectionRatios.set(
              id,
              entry.isIntersecting ? entry.intersectionRatio : 0,
            );
          }
        });

        const [mostVisible] = [...intersectionRatios.entries()].sort(
          (a, b) => b[1] - a[1],
        );

        if (mostVisible && mostVisible[1] >= 0.45) {
          onActivateCategory(mostVisible[0]);
        }
      },
      {
        root: viewport,
        rootMargin: "0px -10% 0px -10%",
        threshold: [0.35, 0.45, 0.6, 0.75, 0.9],
      },
    );

    cardRefs.current.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      intersectionRatios.clear();
    };
  }, [isMobileLayout, onActivateCategory]);

  useEffect(() => {
    if (!isMobileLayout || !isActive) return;

    const card = cardRefs.current.get(activeCategoryId);

    if (!card) return;

    const frame = window.requestAnimationFrame(() => {
      card.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
        inline: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeCategoryId, isActive, isMobileLayout]);

  const handlePointerEnter = (
    id: PortfolioCategoryId,
    event: PointerEvent<HTMLAnchorElement>,
  ) => {
    if (event.pointerType !== "mouse") return;
    setIsInteractionActive(true);
    onActivateCategory(id);
  };

  const handleFocus = (id: PortfolioCategoryId) => {
    setIsInteractionActive(true);
    onActivateCategory(id);
  };

  const handleBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      viewportRef.current?.contains(nextTarget)
    ) {
      return;
    }

    setIsInteractionActive(false);
  };

  return (
    <section
      className="home-stage-layer category-directory"
      aria-hidden={!isActive}
      aria-labelledby="work-directory-title"
      inert={!isActive ? true : undefined}
    >
      <header className="category-directory-header">
        <p>SELECTED WORK · 02</p>
        <h2 id="work-directory-title">作品目录</h2>
        <span>WORK DIRECTORY</span>
      </header>

      <div
        ref={viewportRef}
        className="category-directory-viewport"
        aria-label="作品分类"
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setIsInteractionActive(false);
        }}
      >
        <div
          className="category-directory-grid"
          data-active-slot={gridActiveSlot}
        >
          {portfolioCategories.map((category) => (
            <div
              className="category-card-slot"
              data-category-id={category.id}
              key={category.id}
            >
              <CategoryCard
                category={category}
                isActive={
                  activeCategoryId === category.id &&
                  (isMobileLayout || isInteractionActive)
                }
                isMediaActive={
                  isActive &&
                  activeCategoryId === category.id &&
                  (isMobileLayout || isInteractionActive)
                }
                registerCard={(node) => registerCard(category.id, node)}
                onPointerEnter={handlePointerEnter}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="category-directory-status" aria-live="polite">
        {String(activeSlot + 1).padStart(2, "0")} / 04
      </p>
    </section>
  );
}
