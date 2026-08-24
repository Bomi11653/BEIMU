import type { Metadata } from "next";
import Link from "next/link";
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

  const poster = category.previewMedia[0]?.poster;

  return (
    <main
      id="main-content"
      className="work-category-page"
      data-category-id={category.id}
      data-route-focus
      tabIndex={-1}
    >
      <div className="work-category-scroll">
        <section className="work-category-hero">
          {poster && (
            <div
              className="work-category-backdrop"
              style={{ backgroundImage: `url("${poster}")` }}
              aria-hidden="true"
            />
          )}
          <div className="work-category-overlay" aria-hidden="true" />

          <nav className="work-category-nav" aria-label="分类页导航">
            <Link href="/">← 返回首页</Link>
            <span>BEIMU · WORKS</span>
          </nav>

          <header className="work-category-heading">
            <p>
              {category.index} / 04 · {category.labelEn}
            </p>
            <h1>{category.labelZh}</h1>
            <span>{category.description}</span>
          </header>

          <p className="work-category-scroll-cue">
            <span>SCROLL TO VIEW</span>
            <span aria-hidden="true">↓</span>
          </p>
        </section>

        <div className="work-category-content">
          <WorkCategoryNav activeCategoryId={category.id} />
          <ProjectArchiveList category={category} />
        </div>
      </div>
    </main>
  );
}
