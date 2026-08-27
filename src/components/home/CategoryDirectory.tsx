"use client";

import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useRouteTransition } from "@/components/transitions/RouteTransitionProvider";
import {
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioCategoryId,
} from "@/data/portfolioCategories";
import { CategoryCard } from "./CategoryCard";

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
  const { isTransitioning, startRouteTransition } = useRouteTransition();
  const [isInteractionActive, setIsInteractionActive] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<PortfolioCategoryId, HTMLAnchorElement>());

  const activeSlot = portfolioCategories.findIndex(
    (category) => category.id === activeCategoryId,
  );
  const gridActiveSlot = isInteractionActive
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

  const handlePointerEnter = (
    id: PortfolioCategoryId,
    event: PointerEvent<HTMLAnchorElement>,
  ) => {
    if (event.pointerType !== "mouse") return;
    setIsInteractionActive(true);
    onActivateCategory(id);
  };

  const handlePointerDown = (
    id: PortfolioCategoryId,
    event: PointerEvent<HTMLAnchorElement>,
  ) => {
    if (event.pointerType === "mouse") return;
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

  const handleNavigate = (
    category: PortfolioCategory,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (isTransitioning) {
      event.preventDefault();
      return;
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onActivateCategory(category.id);
    startRouteTransition(category.route, {
      eyebrow: "OPENING WORKS",
      title: category.labelZh,
      meta: category.labelEn,
    });
  };

  return (
    <section
      className="home-stage-layer category-directory"
      data-transitioning={isTransitioning ? "true" : "false"}
      aria-hidden={!isActive}
      aria-labelledby="work-directory-title"
      aria-busy={isTransitioning ? true : undefined}
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
                  isInteractionActive
                }
                isMediaActive={
                  isActive &&
                  activeCategoryId === category.id &&
                  !isTransitioning
                }
                registerCard={(node) => registerCard(category.id, node)}
                onPointerEnter={handlePointerEnter}
                onPointerDown={handlePointerDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onNavigate={handleNavigate}
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
