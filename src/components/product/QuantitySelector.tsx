import { Minus, Plus } from "lucide-react";
export function QuantitySelector({
  value,
  max,
  onChange,
  label = "数量",
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        type="button"
        disabled={value <= 1}
        aria-label={`${label}を減らす`}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        disabled={value >= max}
        aria-label={`${label}を増やす`}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
