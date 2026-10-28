import type { ReactNode } from "react";
import type { CartLine } from "../../types/order";
import { findProduct } from "../../data/products";
import { ProductImage } from "../product/ProductImage";
import { yen } from "../../utils/currency";
import { LockKeyhole } from "lucide-react";
export function OrderSummary({
  items,
  subtotal,
  shipping,
  children,
}: {
  items: CartLine[];
  subtotal: number;
  shipping: number;
  children?: ReactNode;
}) {
  return (
    <aside className="order-summary panel">
      <h2>ご注文内容</h2>
      <div className="summary-items">
        {items.map((line) => {
          const p = findProduct(line.productId);
          if (!p) return null;
          return (
            <div className="summary-item" key={p.id}>
              <ProductImage product={p} />
              <div>
                <b>{p.name}</b>
                <small>
                  {yen(p.price)} × {line.quantity}点
                </small>
                <span>{yen(p.price * line.quantity)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="totals">
        <div>
          <span>商品小計</span>
          <span>{yen(subtotal)}</span>
        </div>
        <div>
          <span>送料</span>
          <span>{shipping === 0 ? "無料" : yen(shipping)}</span>
        </div>
        <small>表示価格には消費税が含まれています。</small>
        <div className="grand-total">
          <b>合計</b>
          <strong>
            {yen(subtotal + shipping)}
            <small>税込</small>
          </strong>
        </div>
      </div>
      {children}
      <p className="summary-demo">
        <LockKeyhole size={13} />
        デモのため、実際の請求はありません。
      </p>
    </aside>
  );
}
