import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CartLine, Customer, Order, PaymentMethod } from "../types/order";
import { findProduct, products } from "../data/products";
import { shippingFee } from "../utils/currency";

function readStorage(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
function initialCart(): CartLine[] {
  const raw = readStorage("yakuza-cart");
  if (!Array.isArray(raw)) return [];
  return products.flatMap((p) => {
    const quantity = raw
      .filter(
        (x) =>
          x &&
          x.productId === p.id &&
          Number.isInteger(x.quantity) &&
          x.quantity > 0,
      )
      .reduce((n, x) => n + x.quantity, 0);
    return quantity && p.stock
      ? [{ productId: p.id, quantity: Math.min(quantity, p.stock) }]
      : [];
  });
}
function initialFavorites(): string[] {
  const raw = readStorage("yakuza-favorites");
  return Array.isArray(raw)
    ? [
        ...new Set(
          raw.filter(
            (id): id is string => typeof id === "string" && !!findProduct(id),
          ),
        ),
      ]
    : [];
}
const blankCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  postal: "",
  prefecture: "",
  city: "",
  address: "",
};
function useStoreValue() {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [customer, setCustomer] = useState<Customer>(blankCustomer);
  const [payment, setPayment] = useState<PaymentMethod>("クレジットカード");
  const [order, setOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem("yakuza-cart", JSON.stringify(cart));
    } catch {
      setStorageWarning(true);
    }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("yakuza-favorites", JSON.stringify(favorites));
    } catch {
      setStorageWarning(true);
    }
  }, [favorites]);
  const notify = (message: string) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3500);
  };
  const add = (id: string, quantity = 1) => {
    const p = findProduct(id);
    if (!p || !p.stock) return;
    const old = cart.find((l) => l.productId === id)?.quantity ?? 0;
    const next = Math.min(p.stock, old + quantity);
    setCart((lines) => [
      ...lines.filter((l) => l.productId !== id),
      { productId: id, quantity: next },
    ]);
    notify(
      next === old
        ? "在庫数の上限に達しています。"
        : `${p.name}をカートに追加しました。`,
    );
  };
  const update = (id: string, quantity: number) => {
    const p = findProduct(id);
    if (!p) return;
    setCart((lines) =>
      quantity <= 0
        ? lines.filter((l) => l.productId !== id)
        : lines.map((l) =>
            l.productId === id
              ? { ...l, quantity: Math.min(p.stock, quantity) }
              : l,
          ),
    );
  };
  const toggleFavorite = (id: string) => {
    setFavorites((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
    notify(
      favorites.includes(id)
        ? "お気に入りから削除しました。"
        : "お気に入りに追加しました。",
    );
  };
  const subtotal = cart.reduce(
    (sum, l) => sum + (findProduct(l.productId)?.price ?? 0) * l.quantity,
    0,
  );
  const shipping = shippingFee(subtotal);
  const count = cart.reduce((sum, l) => sum + l.quantity, 0);
  const complete = () => {
    const created: Order = {
      number: `YD-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString("ja-JP"),
      items: cart.map((l) => ({ ...l })),
      customer: { ...customer },
      payment,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
    setOrder(created);
    setCart([]);
    setCustomer(blankCustomer);
    return created;
  };
  return {
    cart,
    favorites,
    customer,
    setCustomer,
    payment,
    setPayment,
    order,
    toast,
    setToast,
    notify,
    add,
    update,
    toggleFavorite,
    subtotal,
    shipping,
    count,
    complete,
    storageWarning,
  };
}
const StoreContext = createContext<ReturnType<typeof useStoreValue> | null>(
  null,
);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreValue();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
