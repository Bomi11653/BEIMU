"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useRouteTransition } from "@/components/transitions/RouteTransitionProvider";
import type {
  PortfolioCategory,
  PortfolioProject,
} from "@/data/portfolioCategories";

type ProjectArchiveListProps = {
  category: PortfolioCategory;
};

function projectHref(category: PortfolioCategory, project: PortfolioProject) {
  return `/works/${category.slug}/${project.slug}`;
}

function ProjectPreview({
  category,
  project,
  onOpen,
}: {
  category: PortfolioCategory;
  project: PortfolioProject;
  onOpen: (event: MouseEvent<HTMLAnchorElement>, project: PortfolioProject) => void;
}) {
  return (
    <Link
      className="project-file-preview"
      href={projectHref(category, project)}
      onClick={(event) => onOpen(event, project)}
      aria-label={`打开项目：${project.titleZh}`}
    >
      <span
        className="project-file-preview-image"
        key={project.id}
        style={{
          backgroundImage: `url("${project.cover}")`,
          backgroundPosition: project.coverPosition ?? "85% center",
        }}
        aria-hidden="true"
      />
      <span className="project-file-preview-shade" aria-hidden="true" />
      <span className="project-file-preview-open">VIEW PROJECT</span>
    </Link>
  );
}

export function ProjectArchiveList({ category }: ProjectArchiveListProps) {
  const { isTransitioning, startRouteTransition } = useRouteTransition();
  const [activeProjectId, setActiveProjectId] = useState(
    category.projects[0]?.id ?? "",
  );

  if (category.projects.length === 0) {
    return (
      <section className="project-archive-empty" aria-labelledby="empty-title">
        <p>PROJECT FILES · AWAITING MATERIAL</p>
        <h2 id="empty-title">文件位置已预留</h2>
        <span>
          回到个人电脑后，只需放入真实项目素材并更新数据，列表和详情路径会自动生成。
        </span>
        <Link href="/">返回首页</Link>
      </section>
    );
  }

  const activeProject =
    category.projects.find((project) => project.id === activeProjectId) ??
    category.projects[0];

  const openProject = (
    event: MouseEvent<HTMLAnchorElement>,
    project: PortfolioProject,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    startRouteTransition(projectHref(category, project), {
      title: project.titleZh,
      meta: `${project.year ?? "YEAR TBC"} · ${project.titleEn}`,
    });
  };

  return (
    <section className="project-file-browser" aria-labelledby="archive-title">
      <div className="project-file-stage">
        <ProjectPreview
          category={category}
          project={activeProject}
          onOpen={openProject}
        />
      </div>

      <div className="project-file-index">
        <header className="project-file-heading">
          <p>作品　/　WORKS</p>
          <h1 id="archive-title">{category.labelZh}</h1>
        </header>

        <ol className="project-file-list">
          {category.projects.map((project, index) => {
            const isActive = project.id === activeProject.id;

            return (
              <li key={project.id}>
                <Link
                  className={`project-file-row${isActive ? " is-active" : ""}`}
                  href={projectHref(category, project)}
                  onClick={(event) => openProject(event, project)}
                  onMouseEnter={() => setActiveProjectId(project.id)}
                  onFocus={() => setActiveProjectId(project.id)}
                  onTouchStart={() => setActiveProjectId(project.id)}
                  aria-label={`打开项目：${project.titleZh}`}
                  aria-disabled={isTransitioning}
                >
                  <span className="project-file-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="project-file-year">
                    {project.year ?? "—"}
                  </span>
                  <span className="project-file-title">
                    <strong>{project.titleZh}</strong>
                    <small>{project.summary}</small>
                  </span>
                  <span className="project-file-arrow" aria-hidden="true">
                    VIEW
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
