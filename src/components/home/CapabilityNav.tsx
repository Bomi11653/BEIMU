import type { Capability, CapabilityId } from "@/data/capabilities";

type CapabilityNavProps = {
  id?: string;
  items: Capability[];
  activeId: CapabilityId;
  onActivate: (id: CapabilityId) => void;
};

export function CapabilityNav({
  id,
  items,
  activeId,
  onActivate,
}: CapabilityNavProps) {
  return (
    <nav id={id} className="capability-nav" aria-label="作品领域">
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            className={`capability-item${isActive ? " is-active" : ""}`}
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onActivate(item.id)}
          >
            <span className="capability-index">{item.index}</span>
            <span className="capability-label">{item.label}</span>
            <span className="capability-underline" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
