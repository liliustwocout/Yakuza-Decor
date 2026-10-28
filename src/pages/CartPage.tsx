import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Trash2, Truck } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { findProduct } from "../data/products";
import { yen } from "../utils/currency";
import { PageHeading, EmptyState } from "../components/ui/PageHeading";
import { QuantitySelector } from "../components/product/QuantitySelector";
import { ProductImage } from "../components/product/ProductImage";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { Modal } from "../components/ui/Modal";
export function CartPage() {
  const { cart, count, subtotal, shipping, update, notify } = useStore();
  const [remove, setRemove] = useState<string | null>(null);
  return (
    <>
      <PageHeading
        title="ショッピングカート"
        description="お気に入りの一品を、あなたのもとへ。"
      />
      <div className="container checkout-container">
        <CheckoutStepper step={1} />
        {!cart.length ? (
          <EmptyState title="カートに商品がありません" />
        ) : (
          <div className="checkout-layout">
            <div>
              <div className="cart-heading">
                <h2>カートの商品</h2>
                <span>{count}点</span>
              </div>
              <div className="cart-lines">
                {cart.map((line) => {
                  const p = findProduct(line.productId)!;
                  return (
                    <article className="cart-item" key={p.id}>
                      <Link to={`/products/${p.slug}`}>
                        <ProductImage product={p} />
                      </Link>
                      <div className="cart-item-content">
                        <small>{p.category}</small>
                        <Link to={`/products/${p.slug}`}>
                          <h3>{p.name}</h3>
                        </Link>
                        <span className="cart-unit-price">
                          {yen(p.price)}
                          <small>税込</small>
                        </span>
                        <QuantitySelector
                          value={line.quantity}
                          max={p.stock}
                          label={`${p.name}の数量`}
                          onChange={(q) => update(p.id, q)}
                        />
                      </div>
                      <div className="cart-item-total">
                        <strong>{yen(p.price * line.quantity)}</strong>
                        <button
                          className="plain-button"
                          onClick={() => setRemove(p.id)}
                          aria-label={`${p.name}を削除`}
                        >
                          <Trash2 size={15} />
                          削除
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="shipping-note">
                <Truck size={20} />
                {subtotal >= 30000
                  ? "このご注文は送料無料です。"
                  : `あと${yen(30000 - subtotal)}のお買い上げで送料無料になります。`}
              </div>
              <Link className="text-link" to="/products">
                <ArrowLeft size={16} />
                お買い物を続ける
              </Link>
            </div>
            <OrderSummary items={cart} subtotal={subtotal} shipping={shipping}>
              <Link className="button full" to="/checkout">
                注文確認に進む
                <ArrowRight size={17} />
              </Link>
            </OrderSummary>
          </div>
        )}
      </div>
      {remove && (
        <Modal title="商品を削除しますか？" onClose={() => setRemove(null)}>
          <p>{findProduct(remove)?.name}をカートから削除します。</p>
          <div className="modal-actions">
            <button
              className="button button-outline"
              onClick={() => setRemove(null)}
            >
              キャンセル
            </button>
            <button
              className="button"
              onClick={() => {
                update(remove, 0);
                setRemove(null);
                notify("カートから商品を削除しました。");
              }}
            >
              削除する
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
