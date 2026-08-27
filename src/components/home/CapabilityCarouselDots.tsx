import type { Capability, CapabilityId } from "@/data/capabilities";

type CapabilityCarouselDotsProps = {
  items: Capability[];
  activeId: CapabilityId;
  onActivate: (id: CapabilityId) => void;
};

export function CapabilityCarouselDots({
  items,
  activeId,
  onActivate,
}: CapabilityCarouselDotsProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <div
      className="capability-carousel-dots"
      role="tablist"
      aria-label="作品分类轮播"
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={isActive ? "is-active" : undefined}
            aria-selected={isActive}
            aria-label={`${item.index} ${item.label}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onActivate(item.id)}
          >
            <span className="capability-carousel-dot-index" aria-hidden="true">
              {item.index}
            </span>
            <span className="capability-carousel-dot-label">{item.label}</span>
          </button>
        );
      })}
      <p className="capability-carousel-status" aria-live="polite">
        {activeIndex >= 0
          ? `${items[activeIndex].index} / ${String(items.length).padStart(2, "0")}`
          : null}
      </p>
    </div>
  );
}
