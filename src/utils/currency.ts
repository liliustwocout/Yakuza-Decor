export const yen = (value: number) => `¥${value.toLocaleString("ja-JP")}`;
export const shippingFee = (subtotal: number) =>
  subtotal >= 30000 || subtotal === 0 ? 0 : 800;
