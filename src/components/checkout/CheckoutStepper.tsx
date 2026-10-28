import { Check } from "lucide-react";
export function CheckoutStepper({ step }: { step: number }) {
  return (
    <ol className="checkout-steps" aria-label="注文の進行状況">
      {["カート", "注文確認", "決済", "完了"].map((label, i) => (
        <li
          key={label}
          className={i + 1 === step ? "current" : i + 1 < step ? "done" : ""}
          aria-current={i + 1 === step ? "step" : undefined}
        >
          <span>{i + 1 < step ? <Check size={15} /> : i + 1}</span>
          <b>{label}</b>
        </li>
      ))}
    </ol>
  );
}
