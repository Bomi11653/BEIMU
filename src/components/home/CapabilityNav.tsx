import type { Capability } from "@/data/capabilities";

type CapabilityNavProps = {
  items: Capability[];
};

export function CapabilityNav({ items }: CapabilityNavProps) {
  return (
    <nav className="capability-nav" aria-label="作品领域">
      {items.map((item, index) => (
        <label className="capability-item" key={item.id}>
          <input
            className="capability-control"
            type="radio"
            name="capability"
            value={item.id}
            defaultChecked={index === 0}
          />
          <span className="capability-index">{item.index}</span>
          <span className="capability-label">{item.label}</span>
          <span className="capability-underline" aria-hidden="true" />
        </label>
      ))}
    </nav>
  );
}
