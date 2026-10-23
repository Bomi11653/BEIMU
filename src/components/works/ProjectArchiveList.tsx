"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useRouteTransition } from "@/components/transitions/RouteTransitionProvider";
import { useFinePointer } from "@/hooks/useFinePointer";
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
  const finePointer = useFinePointer();
  return (
    <Link
      className="project-file-preview"
      prefetch={false}
      href={projectHref(category, project)}
      onClick={(event) => onOpen(event, project)}
      aria-label={`打开项目：${project.titleZh}`}
    >
      {project.teaser && finePointer ? (
        <video
          className="project-file-preview-video"
          key={project.id}
          src={project.teaser}
          poster={project.cover}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <span
          className="project-file-preview-image"
          key={project.id}
          style={{
            backgroundImage: `url("${project.cover}")`,
            backgroundPosition: project.coverPosition ?? "85% center",
          }}
          aria-hidden="true"
        />
      )}
      <span className="project-file-preview-shade" aria-hidden="true" />
      <span className="project-file-preview-open">
        {project.teaser ? "PREVIEW · 3S" : "VIEW PROJECT"}
      </span>
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
        <p>PROJECTS · IN PREPARATION</p>
        <h2 id="empty-title">作品整理中</h2>
        <span>
          该分类的作品资料正在整理，敬请期待。
        </span>
        <Link href="/?stage=2">返回作品目录</Link>
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
      description: project.summary,
      meta: project.titleEn,
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
          <p>{category.labelEn}</p>
          <h1 id="archive-title">{category.labelZh}</h1>
        </header>

        <ol className="project-file-list">
          {category.projects.map((project, index) => {
            const isActive = project.id === activeProject.id;
            const rowClass = `project-file-row${isActive ? " is-active" : ""}`;
            const useExternalActions = Boolean(project.externalUrl);
            const externalLabel = project.externalUrl?.includes("douyin.com")
              ? "抖音"
              : project.externalUrl?.includes("bilibili.com")
                ? "Bilibili"
                : "跳转";

            if (useExternalActions) {
              return (
                <li key={project.id}>
                  <div
                    className={rowClass}
                    onPointerEnter={(event) => { if (event.pointerType === "mouse") setActiveProjectId(project.id); }}
                    onFocusCapture={() => setActiveProjectId(project.id)}
                  >
                    <span className="project-file-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="project-file-year">
                      {project.year ?? "—"}
                    </span>
                    <span className="project-file-title">
                      <Link href={projectHref(category, project)} prefetch={false} onClick={(event) => openProject(event, project)}>
                        <strong>{project.titleZh}</strong>
                      </Link>
                      <small>{project.summary}</small>
                    </span>
                    <div className="project-file-actions">
                      <Link
                        className="project-file-action"
                        prefetch={false}
                        href={projectHref(category, project)}
                        onClick={(event) => openProject(event, project)}
                        aria-disabled={isTransitioning}
                      >
                        详情
                      </Link>
                      <a
                        className="project-file-action is-external"
                        href={project.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {externalLabel}
                      </a>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={project.id}>
                <Link
                  className={rowClass}
                  prefetch={false}
                  href={projectHref(category, project)}
                  onClick={(event) => openProject(event, project)}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") setActiveProjectId(project.id); }}
                  onFocus={() => setActiveProjectId(project.id)}
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
