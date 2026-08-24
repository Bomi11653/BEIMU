"use client";

import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import type { PortfolioCategory } from "@/data/portfolioCategories";

export type CategoryTransitionRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type CategoryTransitionOverlayProps = {
  category: PortfolioCategory;
  rect: CategoryTransitionRect;
  isExpanded: boolean;
};

type TransitionStyle = CSSProperties & {
  "--category-transition-top": string;
  "--category-transition-left": string;
  "--category-transition-width": string;
  "--category-transition-height": string;
  "--category-transition-position": string;
};

export function CategoryTransitionOverlay({
  category,
  rect,
  isExpanded,
}: CategoryTransitionOverlayProps) {
  const preview = category.previewMedia[0];
  const style: TransitionStyle = {
    "--category-transition-top": `${rect.top}px`,
    "--category-transition-left": `${rect.left}px`,
    "--category-transition-width": `${rect.width}px`,
    "--category-transition-height": `${rect.height}px`,
    "--category-transition-position": preview?.objectPosition ?? "center center",
    backgroundImage: preview?.poster
      ? `url("${preview.poster}")`
      : undefined,
  };

  return createPortal(
    <div
      className={`category-transition-overlay${
        isExpanded ? " is-expanded" : ""
      }${preview ? "" : " is-empty"}`}
      style={style}
      aria-hidden="true"
    >
      {!preview && (
        <div className="category-transition-empty">
          <span>CASE ASSETS</span>
          <span>IN PREPARATION</span>
        </div>
      )}
      <div className="category-transition-scrim" />
      <span className="category-transition-index">
        {category.index} / 04 · {category.labelEn}
      </span>
      <div className="category-transition-copy">
        <h2>{category.labelZh}</h2>
        <p>{category.description}</p>
      </div>
    </div>,
    document.body,
  );
}
