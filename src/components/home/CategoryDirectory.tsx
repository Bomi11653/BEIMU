"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioCategoryId,
} from "@/data/portfolioCategories";
import { CategoryCard } from "./CategoryCard";
import {
  CategoryTransitionOverlay,
  type CategoryTransitionRect,
} from "./CategoryTransitionOverlay";

const CATEGORY_TRANSITION_MS = 760;

type CategoryTransitionState = {
  category: PortfolioCategory;
  rect: CategoryTransitionRect;
  isExpanded: boolean;
};

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
  const router = useRouter();
  const [isInteractionActive, setIsInteractionActive] = useState(false);
  const [transition, setTransition] =
    useState<CategoryTransitionState | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<PortfolioCategoryId, HTMLAnchorElement>());
  const transitionTimerRef = useRef<number | null>(null);
  const transitionFrameRef = useRef<number | null>(null);

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

  useEffect(
    () => () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }

      if (transitionFrameRef.current !== null) {
        window.cancelAnimationFrame(transitionFrameRef.current);
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
    if (transition) {
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    event.preventDefault();
    onActivateCategory(category.id);

    const bounds = event.currentTarget.getBoundingClientRect();
    setTransition({
      category,
      rect: {
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      },
      isExpanded: false,
    });

    transitionFrameRef.current = window.requestAnimationFrame(() => {
      transitionFrameRef.current = window.requestAnimationFrame(() => {
        setTransition((current) =>
          current ? { ...current, isExpanded: true } : current,
        );
        transitionFrameRef.current = null;
      });
    });

    transitionTimerRef.current = window.setTimeout(() => {
      router.push(category.route, { scroll: false });
      transitionTimerRef.current = null;
    }, CATEGORY_TRANSITION_MS);
  };

  return (
    <section
      className="home-stage-layer category-directory"
      data-transitioning={transition ? "true" : "false"}
      aria-hidden={!isActive}
      aria-labelledby="work-directory-title"
      aria-busy={transition ? true : undefined}
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
                  !transition
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

      {transition && (
        <CategoryTransitionOverlay
          category={transition.category}
          rect={transition.rect}
          isExpanded={transition.isExpanded}
        />
      )}
    </section>
  );
}
