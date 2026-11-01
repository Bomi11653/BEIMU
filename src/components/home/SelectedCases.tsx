import { portfolioCategories } from "@/data/portfolioCategories";
import { WorkLink } from "@/components/works/WorkLink";

const selections = [
  { category: "3d-scene", project: "ice-lock-cold-river", label: "3D ENVIRONMENT", role: "从场景设计、资产搭建到最终渲染，由我独立完成。", scope: ["场景设计", "资产搭建", "场景渲染"], images: [1, 4, 7] },
  { category: "graphic-design", project: "burger-visual-design", label: "GRAPHIC DESIGN", role: "负责汉堡摄影、基于产品的 AI 图像创作、系列海报设计与素材数据库管理。", scope: ["产品摄影与 AI 创作", "海报设计", "素材资产管理"], images: [1, 5, 8] },
  { category: "ai-development", project: "dbsource-pro", label: "WEB DESIGN & DEVELOPMENT", role: "负责品牌网站的前端视觉与页面、内容管理后台，以及数据库搭建与管理。", scope: ["前端设计与开发", "后台设计", "数据库搭建与管理"], images: [1, 4, 6] },
];

export function SelectedCases() {
  return <div className="selected-cases">
    <header className="selected-cases-heading"><h2 id="home-category-title">精选案例<span lang="en">SELECTED WORKS</span></h2><span>01 — 03</span></header>
    {selections.map((selection, index) => {
      const category = portfolioCategories.find(item => item.id === selection.category);
      const project = category?.projects.find(item => item.id === selection.project);
      if (!category || !project) return null;
      const href = `${category.route}/${project.slug}`;
      const images = project.gallery.filter(item => item.kind === "image");
      const previews = selection.images.map(i => images[i]).filter(Boolean);
      const cover = project.id === "dbsource-pro" ? images[0]?.thumbnailSrc ?? project.cover : project.cover;
      return <article className={`selected-case selected-case-${category.id}`} key={project.id} aria-labelledby={`selected-${project.id}`}>
        <div className="selected-case-hero">
          <WorkLink href={href} title={project.titleZh} className="selected-case-cover" aria-label={`查看${project.titleZh}完整案例`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={project.titleZh} loading="lazy" decoding="async" />
          </WorkLink>
          <div className="selected-case-copy">
            <p className="selected-case-kicker">{String(index + 1).padStart(2, "0")} / {selection.label}{project.year ? ` / ${project.year}` : ""}</p>
            <h3 id={`selected-${project.id}`}>{project.id === "dbsource-pro" ? "dBsource Pro" : project.titleZh}</h3>
            <p className="selected-case-role"><span className="selected-case-role-label">我的工作 / MY ROLE</span>{selection.role}</p>
            <ul className="selected-case-scope" aria-label="负责范围">{selection.scope.map(item => <li key={item}>{item}</li>)}</ul>
            <WorkLink href={href} title={project.titleZh} className="selected-case-action">查看完整案例 <span aria-hidden="true">↗</span></WorkLink>
          </div>
          <span className="selected-case-counter" aria-hidden="true">{String(index + 1).padStart(2, "0")}<i />03</span>
        </div>
        <div className="selected-case-previews" aria-label={`${project.titleZh}细节预览`}>
          {previews.map((image, imageIndex) => <WorkLink key={image.id} href={href} title={project.titleZh} aria-label={`${image.alt}，进入完整案例`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.thumbnailSrc ?? image.src} alt={image.alt} loading="lazy" decoding="async" />
            <span>{String(imageIndex + 1).padStart(2, "0")} / {image.alt}</span>
          </WorkLink>)}
        </div>
      </article>;
    })}
    <nav className="selected-case-categories" aria-label="浏览全部作品分类">
      <p>继续探索 / ALL DISCIPLINES</p>
      {portfolioCategories.map(category => <WorkLink key={category.id} href={category.route} title={category.labelZh}>{category.labelZh}<span aria-hidden="true">↗</span></WorkLink>)}
      <WorkLink href="/works" title="全部作品分类">全部作品<span aria-hidden="true">↗</span></WorkLink>
    </nav>
  </div>;
}
