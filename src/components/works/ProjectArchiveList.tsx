"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  PortfolioCategory,
  PortfolioProject,
} from "@/data/portfolioCategories";

type ProjectArchiveListProps = {
  category: PortfolioCategory;
};

function ProjectPreview({
  category,
  project,
}: {
  category: PortfolioCategory;
  project: PortfolioProject;
}) {
  return (
    <div className="project-file-preview" aria-live="polite">
      <div
        className="project-file-preview-image"
        key={project.id}
        style={{ backgroundImage: `url("${project.cover}")` }}
        aria-hidden="true"
      />
      <div className="project-file-preview-shade" aria-hidden="true" />

      <div className="project-file-preview-topline">
        <span>{category.index} / 04</span>
        <span>{project.year ?? "YEAR TBC"}</span>
      </div>

      <div className="project-file-preview-copy">
        <p>{project.titleEn}</p>
        <h3>{project.titleZh}</h3>
        <span>{project.summary}</span>
      </div>
    </div>
  );
}

export function ProjectArchiveList({ category }: ProjectArchiveListProps) {
  const [activeProjectId, setActiveProjectId] = useState(
    category.projects[0]?.id ?? "",
  );

  if (category.projects.length === 0) {
    return (
      <section className="project-archive-empty" aria-labelledby="empty-title">
        <p>PROJECT FILES · AWAITING MATERIAL</p>
        <h2 id="empty-title">文件位置已预留</h2>
        <span>
          回到个人电脑后，只需把真实项目素材放入对应目录并更新数据文件，列表和详情路径会自动生成。
        </span>
        <Link href="/">返回首页</Link>
      </section>
    );
  }

  const activeProject =
    category.projects.find((project) => project.id === activeProjectId) ??
    category.projects[0];

  return (
    <section className="project-file-browser" aria-labelledby="archive-title">
      <div className="project-file-index">
        <header className="project-file-heading">
          <p>PROJECT FILES</p>
          <h2 id="archive-title">作品列表</h2>
          <span>{String(category.projects.length).padStart(2, "0")} FILES</span>
        </header>

        <ol className="project-file-list">
          {category.projects.map((project, index) => {
            const isActive = project.id === activeProject.id;

            return (
              <li key={project.id}>
                <Link
                  className={`project-file-row${isActive ? " is-active" : ""}`}
                  href={`/works/${category.slug}/${project.slug}`}
                  onMouseEnter={() => setActiveProjectId(project.id)}
                  onFocus={() => setActiveProjectId(project.id)}
                  onTouchStart={() => setActiveProjectId(project.id)}
                  aria-label={`打开项目文件：${project.titleZh}`}
                >
                  <span className="project-file-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="project-file-title">
                    <strong>{project.titleZh}</strong>
                    <small>{project.titleEn}</small>
                  </span>

                  <span className="project-file-meta">
                    {project.roleZh ?? category.labelZh}
                  </span>
                  <span className="project-file-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <footer className="project-file-footer">
          <span>HOVER TO PREVIEW</span>
          <span>CLICK ANY ROW TO OPEN</span>
        </footer>
      </div>

      <div className="project-file-stage">
        <ProjectPreview category={category} project={activeProject} />
      </div>
    </section>
  );
}
