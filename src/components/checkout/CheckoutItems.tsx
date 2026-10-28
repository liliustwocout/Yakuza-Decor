import { Link } from "react-router-dom";
import { findProduct } from "../../data/products";
import type { CartLine } from "../../types/order";
import { yen } from "../../utils/currency";
import { ProductImage } from "../product/ProductImage";

export function CheckoutItems({ items }: { items: CartLine[] }) {
  return (
    <section className="panel checkout-review">
      <h2>注文確認</h2>
      {items.map((line) => {
        const product = findProduct(line.productId);
        if (!product) return null;
        return (
          <article key={product.id} className="review-product">
            <Link to={`/products/${product.slug}`}>
              <ProductImage product={product} />
            </Link>
            <div>
              <h3>{product.name}</h3>
              <strong>{yen(product.price)}</strong>
              <p>数量：{line.quantity}</p>
              <Link className="text-link" to={`/products/${product.slug}`}>
                詳細を見る
              </Link>
            </div>
            <div className="review-line-total">
              <span>小計</span>
              <strong>{yen(product.price * line.quantity)}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
