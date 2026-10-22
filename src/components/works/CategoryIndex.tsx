import { portfolioCategories } from "@/data/portfolioCategories";
import { WorkLink } from "./WorkLink";

export function CategoryIndex({ headingId, standalone = false }: {
  headingId: string; standalone?: boolean;
}) {
  const Heading = standalone ? "h1" : "h2";
  const categories = [
    ...portfolioCategories.filter((category) => category.id !== "ai-development"),
    ...portfolioCategories.filter((category) => category.id === "ai-development"),
  ];
  return (
    <div className="category-index">
      <header className="category-index-heading">
        <div><p>BEIMU / WORK DIRECTORY</p><Heading id={headingId}>作品分类</Heading></div>
        {standalone ? <WorkLink href="/?stage=2" title="作品目录">返回首页作品模块 ↗</WorkLink> : <p>{String(portfolioCategories.length).padStart(2, "0")} CATEGORIES</p>}
      </header>
      <ol className="category-index-list" aria-label="作品分类入口">
        {categories.map((category, index) => {
          const project = category.projects.find((item) => item.id === category.representativeProjectId) ?? category.projects[0];
          const alternate = project?.gallery.find((item) => item.kind === "image" && item.src !== project.cover);
          return (
            <li key={category.id} className="category-index-item">
              <WorkLink href={category.route} title={category.labelZh} className="category-index-link">
                <span className="category-index-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="category-index-media">
                  {project ? (
                    <>
                      {/* Archive crops are navigational previews; full images remain in the project. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.cover} alt="" loading="lazy" style={{ objectPosition: project.coverPosition }} />
                      {alternate ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="category-index-alternate" src={alternate.src} alt="" loading="lazy" style={{ objectPosition: alternate.objectPosition }} />
                      ) : null}
                    </>
                  ) : <span className="category-index-placeholder">素材待补充<span lang="en">IN PREPARATION</span></span>}
                  <span className="category-index-arrow" aria-hidden="true">↗</span>
                </div>
                <div className="category-index-caption"><h3>{category.labelZh}</h3><p lang="en">{category.labelEn}</p></div>
                <div className="category-index-meta">
                  <span>{project ? `代表作 · ${project.titleZh}` : "平面 / 海报"}</span>
                  <span>{category.projects.length ? `${String(category.projects.length).padStart(2, "0")} 个项目` : "作品整理中"}</span>
                </div>
              </WorkLink>
            </li>
          );
        })}
      </ol>
      <p className="category-index-footer">选择分类，浏览该方向的全部项目 <span aria-hidden="true">↗</span></p>
    </div>
  );
}
