import { CategoryIndex } from "./CategoryIndex";

export function WorkArchive() {
  return (
    <main id="main-content" className="work-archive category-index-scroll" data-route-focus tabIndex={-1}>
      <CategoryIndex headingId="archive-category-title" standalone />
    </main>
  );
}
