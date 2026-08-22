import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="work-category-page">
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
        <p>{category.index} / 04 · {category.labelEn}</p>
        <h1>{category.labelZh}</h1>
        <span>{category.description}</span>
      </header>

      <div className="work-category-building-status">
        <span>{category.contentStatus === "awaiting-asset" ? "素材整理中" : "下一阶段"}</span>
        <p>
          {category.contentStatus === "awaiting-asset"
            ? "真实案例素材补齐后将在此发布。"
            : "作品列表建设中。现有项目资产已经完成归类。"}
        </p>
      </div>
    </main>
  );
}
