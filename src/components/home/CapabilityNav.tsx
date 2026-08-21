import type { Capability, CapabilityId } from "@/data/capabilities";

type CapabilityNavProps = {
  items: Capability[];
  activeId: CapabilityId;
  onActivate: (id: CapabilityId) => void;
};

export function CapabilityNav({
  items,
  activeId,
  onActivate,
}: CapabilityNavProps) {
  return (
    <nav className="capability-nav" aria-label="作品领域">
      {items.map((item) => (
        <label
          className="capability-item"
          key={item.id}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              onActivate(item.id);
            }
          }}
          onFocus={() => onActivate(item.id)}
        >
          <input
            className="capability-control"
            type="radio"
            name="capability"
            value={item.id}
            checked={activeId === item.id}
            onChange={() => onActivate(item.id)}
          />
          <span className="capability-index">{item.index}</span>
          <span className="capability-label">{item.label}</span>
          <span className="capability-underline" aria-hidden="true" />
        </label>
      ))}
    </nav>
  );
}
