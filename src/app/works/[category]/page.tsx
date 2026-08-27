import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArchiveList } from "@/components/works/ProjectArchiveList";
import { WorkCategoryNav } from "@/components/works/WorkCategoryNav";
import {
  portfolioCategories,
  type PortfolioCategory,
} from "@/data/portfolioCategories";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioCategories.map((category) => ({
    category: category.slug,
  }));
}

const findCategory = (slug: string): PortfolioCategory | undefined =>
  portfolioCategories.find((category) => category.slug === slug);

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(slug);

  if (!category) return {};

  return {
    title: `${category.labelZh} — 郑荣成 / BEIMU`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = findCategory(slug);

  if (!category) notFound();

  return (
    <main
      id="main-content"
      className="work-category-page"
      data-category-id={category.id}
      data-route-focus
      tabIndex={-1}
    >
      <div
        className="work-category-scroll work-category-file-view"
        tabIndex={0}
        aria-label={`${category.labelZh}作品页面`}
      >
        <p className="work-category-meta-left">BEIMU / WORKS</p>
        <p className="work-category-meta-right">
          {String(category.projects.length).padStart(2, "0")} PROJECTS · 2025—2026
        </p>
        <WorkCategoryNav activeCategoryId={category.id} />
        <ProjectArchiveList category={category} />
      </div>
    </main>
  );
}
