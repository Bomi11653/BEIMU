"use client";

import Link from "next/link";
import type {
  FocusEvent,
  MouseEvent,
  PointerEvent,
  RefCallback,
} from "react";
import type { PortfolioCategory } from "@/data/portfolioCategories";
import { CategoryPreviewMedia } from "./CategoryPreviewMedia";

type CategoryCardProps = {
  category: PortfolioCategory;
  isActive: boolean;
  isMediaActive: boolean;
  registerCard: RefCallback<HTMLAnchorElement>;
  onPointerEnter: (
    id: PortfolioCategory["id"],
    event: PointerEvent<HTMLAnchorElement>,
  ) => void;
  onPointerDown: (
    id: PortfolioCategory["id"],
    event: PointerEvent<HTMLAnchorElement>,
  ) => void;
  onFocus: (id: PortfolioCategory["id"]) => void;
  onBlur: (event: FocusEvent<HTMLAnchorElement>) => void;
  onNavigate: (
    category: PortfolioCategory,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
};

export function CategoryCard({
  category,
  isActive,
  isMediaActive,
  registerCard,
  onPointerEnter,
  onPointerDown,
  onFocus,
  onBlur,
  onNavigate,
}: CategoryCardProps) {
  const isAwaitingAsset = category.contentStatus === "awaiting-asset";

  return (
    <Link
      ref={registerCard}
      className={`category-card${isActive ? " is-active" : ""}${
        isAwaitingAsset ? " is-awaiting-asset" : ""
      }`}
      href={category.route}
      data-category-id={category.id}
      aria-label={`查看${category.labelZh}作品列表`}
      onPointerEnter={(event) => onPointerEnter(category.id, event)}
      onPointerDown={(event) => onPointerDown(category.id, event)}
      onFocus={() => onFocus(category.id)}
      onBlur={onBlur}
      onClick={(event) => onNavigate(category, event)}
    >
      <CategoryPreviewMedia
        media={category.previewMedia[0]}
        isActive={isMediaActive}
        isAwaitingAsset={isAwaitingAsset}
      />

      <div className="category-card-scrim" aria-hidden="true" />

      <div className="category-card-index">{category.index}</div>

      <div className="category-card-copy">
        <p>{category.labelEn}</p>
        <h3>{category.labelZh}</h3>
        <span>{category.description}</span>
      </div>

      <div className="category-card-action">
        <span>{isAwaitingAsset ? "素材整理中" : "查看作品"}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
