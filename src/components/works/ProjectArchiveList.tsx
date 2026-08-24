import Link from "next/link";
import type { PortfolioCategory } from "@/data/portfolioCategories";

type ProjectArchiveListProps = {
  category: PortfolioCategory;
};

export function ProjectArchiveList({ category }: ProjectArchiveListProps) {
  if (category.projects.length === 0) {
    return (
      <section className="project-archive-empty" aria-labelledby="empty-title">
        <p>ARCHIVE STATUS · AWAITING MATERIAL</p>
        <h2 id="empty-title">案例素材整理中</h2>
        <span>
          这里将只发布真实的新媒体账号、视频预览和运营结果，不使用其他分类素材代替。
        </span>
        <Link href="/">返回首页</Link>
      </section>
    );
  }

  return (
    <section className="project-archive" aria-labelledby="archive-title">
      <header className="project-archive-header">
        <p>PROJECT ARCHIVE</p>
        <h2 id="archive-title">精选作品</h2>
        <span>{String(category.projects.length).padStart(2, "0")} PROJECTS</span>
      </header>

      <div className="project-archive-list">
        {category.projects.map((project, index) => (
          <article
            className="project-archive-item"
            data-layout={index % 2 === 0 ? "media-first" : "copy-first"}
            key={project.id}
          >
            <Link
              className="project-archive-link"
              href={`/works/${category.slug}/${project.slug}`}
              aria-label={`查看项目：${project.titleZh}`}
            >
              <div
                className="project-archive-media"
                style={{ backgroundImage: `url("${project.cover}")` }}
                aria-hidden="true"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="project-archive-copy">
                <p>{project.titleEn}</p>
                <h3>{project.titleZh}</h3>
                <span>{project.summary}</span>

                {(project.year || project.roleZh || project.services?.length) && (
                  <dl>
                    {project.year && (
                      <div>
                        <dt>YEAR</dt>
                        <dd>{project.year}</dd>
                      </div>
                    )}
                    {project.roleZh && (
                      <div>
                        <dt>ROLE</dt>
                        <dd>{project.roleZh}</dd>
                      </div>
                    )}
                    {project.services?.length && (
                      <div>
                        <dt>SERVICES</dt>
                        <dd>{project.services.join(" · ")}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="project-archive-action">
                  <span>VIEW CASE</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
