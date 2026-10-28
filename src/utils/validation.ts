import type { Customer } from "../types/order";
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export function validateCustomer(c: Customer) {
  const errors: Partial<Record<keyof Customer, string>> = {};
  for (const key of [
    "name",
    "email",
    "phone",
    "postal",
    "prefecture",
    "city",
    "address",
  ] as const)
    if (!c[key].trim()) errors[key] = "入力してください。";
  if (c.email && !isEmail(c.email))
    errors.email = "正しいメールアドレスを入力してください。";
  if (c.phone && !/^0[\d-]{9,13}$/.test(c.phone))
    errors.phone = "電話番号を正しく入力してください。";
  if (c.postal && !/^\d{3}-?\d{4}$/.test(c.postal))
    errors.postal = "郵便番号を7桁で入力してください。";
  return errors;
}
