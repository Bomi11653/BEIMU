import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectImage } from "@/components/works/ProjectImage";
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
      className={`project-detail-page${project.galleryLayout === "editorial" ? " is-editorial-case" : ""}`}
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

            {project.bodyZh?.length ? (
              <div className="project-detail-body">
                {project.bodyZh.map((block, blockIndex) => (
                  <div
                    className="project-detail-body-block"
                    key={`${block.title ?? "lead"}-${blockIndex}`}
                  >
                    {block.title ? <h2>{block.title}</h2> : null}
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}

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

        {project.gallery.length > 0 ? (
          <section className="project-detail-gallery" data-layout={project.galleryLayout} aria-label="项目媒体">
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
                  <ProjectImage
                    src={item.src}
                    thumbnailSrc={item.thumbnailSrc}
                    alt={item.alt}
                    eager={index === 0}
                    objectPosition={item.objectPosition}
                    dismissOnTap={project.galleryLayout === "editorial"}
                  />
                )}
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.alt}{item.caption ? <p>{item.caption}</p> : null}</span>
                </figcaption>
              </figure>
            ))}
          </section>
        ) : null}

        <section className="project-contact-invitation" aria-labelledby="project-contact-title">
          <p>LET’S WORK TOGETHER</p>
          <h2 id="project-contact-title">你的下一个项目，<br />我们可以从这里开始。</h2>
          <p className="project-contact-description">告诉我你的项目类型、想实现的效果与时间安排，我们一起讨论适合的设计方向。</p>
          <Link href="/?stage=4" className="project-contact-action">联系我，讨论项目 <span aria-hidden="true">↗</span></Link>
          <span className="project-contact-note">微信 · 邮箱 · 各平台入口</span>
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
                {project.externalUrl.includes("douyin.com")
                  ? "在抖音观看 ↗"
                  : project.externalUrl.includes("bilibili.com")
                    ? "在 Bilibili 观看 ↗"
                    : "访问线上项目 ↗"}
              </a>
            )}
            <Link href={category.route}>返回作品列表</Link>
            <Link href="/?stage=2">继续浏览精选案例 ↗</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
