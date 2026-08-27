import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/data/portfolioCategories";

type ProjectPageProps = {
  params: Promise<{ category: string; project: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioCategories.flatMap((category) =>
    category.projects.map((project) => ({
      category: category.slug,
      project: project.slug,
    })),
  );
}

const findProject = (
  categorySlug: string,
  projectSlug: string,
): { category: PortfolioCategory; project: PortfolioProject } | undefined => {
  const category = portfolioCategories.find(
    (item) => item.slug === categorySlug,
  );
  const project = category?.projects.find((item) => item.slug === projectSlug);

  return category && project ? { category, project } : undefined;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { category: categorySlug, project: projectSlug } = await params;
  const result = findProject(categorySlug, projectSlug);

  if (!result) return {};

  return {
    title: `${result.project.titleZh} — 郑荣成 / BEIMU`,
    description: result.project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category: categorySlug, project: projectSlug } = await params;
  const result = findProject(categorySlug, projectSlug);

  if (!result) notFound();

  const { category, project } = result;

  return (
    <main
      id="main-content"
      className="project-detail-page"
      data-route-focus
      tabIndex={-1}
    >
      <div className="project-detail-scroll">
        <nav className="project-detail-nav" aria-label="项目详情导航">
          <Link href={category.route}>← {category.labelZh}</Link>
          <span className="project-detail-nav-meta">
            {category.index} · {category.labelEn}
          </span>
        </nav>

        <header className="project-detail-header">
          <div className="project-detail-cover-bleed" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="project-detail-cover-image is-sharp"
              src={project.cover}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="project-detail-cover-image is-blur"
              src={project.cover}
              alt=""
            />
            <div className="project-detail-cover-veil" />
          </div>

          <div className="project-detail-copy">
            <p className="project-detail-kicker">
              {category.index} · {category.labelEn}
            </p>
            <h1>{project.titleZh}</h1>
            <p className="project-detail-title-en">{project.titleEn}</p>
            <p className="project-detail-summary">{project.summary}</p>

            <dl className="project-detail-meta">
              {project.roleZh && (
                <div>
                  <dt>ROLE</dt>
                  <dd>{project.roleZh}</dd>
                </div>
              )}
              {project.services?.length ? (
                <div>
                  <dt>SERVICES</dt>
                  <dd>{project.services.join(" · ")}</dd>
                </div>
              ) : null}
              {project.tools?.length ? (
                <div>
                  <dt>TOOLS</dt>
                  <dd>{project.tools.join(" · ")}</dd>
                </div>
              ) : null}
              {project.year && (
                <div>
                  <dt>YEAR</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        <section className="project-detail-gallery" aria-label="项目媒体">
          {project.gallery.map((item, index) => (
            <figure key={item.id}>
              {item.kind === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={item.alt}
                  style={{ objectPosition: item.objectPosition }}
                />
              ) : (
                // Assets are already prepared at their final display size.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={index > 0 ? "lazy" : "eager"}
                  style={{ objectPosition: item.objectPosition }}
                />
              )}
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.alt}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="project-detail-footer">
          <div>
            <p>
              {project.detailStatus === "ready"
                ? "CASE STUDY"
                : "PROJECT PREVIEW"}
            </p>
            <h2>
              {project.detailStatus === "ready"
                ? "完整项目档案"
                : "更多项目资料整理中"}
            </h2>
          </div>

          <div className="project-detail-actions">
            {project.externalUrl && (
              <a href={project.externalUrl} target="_blank" rel="noreferrer">
                访问线上项目 ↗
              </a>
            )}
            <Link href={category.route}>返回作品列表</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
