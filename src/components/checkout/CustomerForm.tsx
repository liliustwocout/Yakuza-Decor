import type { Customer, PaymentMethod } from "../../types/order";
export const customerFields: {
  key: keyof Customer;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
}[] = [
  {
    key: "name",
    label: "お名前",
    placeholder: "山田 太郎",
    autoComplete: "name",
  },
  {
    key: "email",
    label: "メールアドレス",
    placeholder: "taro@example.com",
    autoComplete: "email",
    type: "email",
  },
  {
    key: "phone",
    label: "電話番号",
    placeholder: "090-1234-5678",
    autoComplete: "tel",
    type: "tel",
  },
  {
    key: "postal",
    label: "郵便番号",
    placeholder: "100-0001",
    autoComplete: "postal-code",
  },
  {
    key: "prefecture",
    label: "都道府県",
    placeholder: "東京都",
    autoComplete: "address-level1",
  },
  {
    key: "city",
    label: "市区町村",
    placeholder: "千代田区千代田",
    autoComplete: "address-level2",
  },
  {
    key: "address",
    label: "番地・建物名",
    placeholder: "1-1 桜ハイツ101",
    autoComplete: "street-address",
  },
];
export function CustomerForm({
  customer,
  onChange,
  errors,
}: {
  customer: Customer;
  onChange: (customer: Customer) => void;
  errors: Partial<Record<keyof Customer, string>>;
}) {
  return (
    <div className="customer-fields">
      {customerFields.map(({ key, label, placeholder, autoComplete, type }) => (
        <div className={`field field-${key}`} key={key}>
          <label htmlFor={`customer-${key}`}>
            {label}
            <span>必須</span>
          </label>
          <input
            id={`customer-${key}`}
            name={key}
            type={type ?? "text"}
            autoComplete={autoComplete}
            value={customer[key]}
            placeholder={placeholder}
            required
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? `error-${key}` : undefined}
            onChange={(e) => onChange({ ...customer, [key]: e.target.value })}
          />
          {errors[key] && (
            <small className="field-error" id={`error-${key}`}>
              {errors[key]}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
export const paymentMethods: PaymentMethod[] = [
  "クレジットカード",
  "銀行振込",
  "代金引換",
];
export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <fieldset className="payment-methods">
      <legend className="sr-only">お支払い方法を選択</legend>
      {paymentMethods.map((method) => (
        <label className={value === method ? "selected" : ""} key={method}>
          <input
            type="radio"
            name="payment"
            value={method}
            checked={value === method}
            onChange={() => onChange(method)}
          />
          <span>{method}</span>
          {method === "クレジットカード" && <small>デモカード</small>}
        </label>
      ))}
    </fieldset>
  );
}
