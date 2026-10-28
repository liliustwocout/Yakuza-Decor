export interface CartLine {
  productId: string;
  quantity: number;
}
export type PaymentMethod = "クレジットカード" | "銀行振込" | "代金引換";
export interface Customer {
  name: string;
  email: string;
  phone: string;
  postal: string;
  prefecture: string;
  city: string;
  address: string;
}
export interface Order {
  number: string;
  date: string;
  items: CartLine[];
  customer: Customer;
  payment: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
}
