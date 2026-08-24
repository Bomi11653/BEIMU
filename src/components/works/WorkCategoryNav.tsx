import Link from "next/link";
import {
  portfolioCategories,
  type PortfolioCategoryId,
} from "@/data/portfolioCategories";

type WorkCategoryNavProps = {
  activeCategoryId: PortfolioCategoryId;
};

export function WorkCategoryNav({ activeCategoryId }: WorkCategoryNavProps) {
  return (
    <nav className="work-category-tabs" aria-label="作品分类导航">
      {portfolioCategories.map((item) => (
        <Link
          href={item.route}
          key={item.id}
          aria-current={item.id === activeCategoryId ? "page" : undefined}
        >
          <span>{item.index}</span>
          <span>{item.labelZh}</span>
        </Link>
      ))}
    </nav>
  );
}
