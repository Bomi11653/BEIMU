"use client";

import { CategoryIndex } from "@/components/works/CategoryIndex";

export function CategoryDirectory({ isActive }: { isActive: boolean }) {
  return (
    <section
      className="home-stage-layer category-directory category-directory-strips"
      aria-hidden={!isActive}
      aria-labelledby="home-category-title"
      inert={!isActive ? true : undefined}
    >
      <div className="category-index-scroll" data-stage-scroll tabIndex={isActive ? 0 : -1} aria-label="作品分类目录">
        <CategoryIndex headingId="home-category-title" />
      </div>
    </section>
  );
}
