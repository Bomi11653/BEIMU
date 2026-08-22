import { portfolioCategories } from "@/data/portfolioCategories";

type CategoryDirectoryShellProps = {
  isActive: boolean;
};

export function CategoryDirectoryShell({
  isActive,
}: CategoryDirectoryShellProps) {
  return (
    <section
      className="home-stage-layer category-directory-shell"
      aria-hidden={!isActive}
      aria-labelledby="work-directory-title"
      inert={!isActive ? true : undefined}
    >
      <div className="directory-shell-content">
        <header className="directory-shell-header">
          <p>SELECTED WORK · 02</p>
          <h2 id="work-directory-title">作品目录</h2>
          <span>WORK DIRECTORY</span>
        </header>

        <div className="directory-wireframe" aria-label="四个作品大类结构预览">
          {portfolioCategories.map((category) => (
            <article className="directory-wireframe-item" key={category.id}>
              <span>{category.index}</span>
              <div>
                <h3>{category.labelZh}</h3>
                <p>{category.labelEn}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </article>
          ))}
        </div>

        <p className="directory-shell-note">
          CATEGORY STRUCTURE · VISUAL CARDS AND ROUTES FOLLOW IN NODE B
        </p>
      </div>
    </section>
  );
}
