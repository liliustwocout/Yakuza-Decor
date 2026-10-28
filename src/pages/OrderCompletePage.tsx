import { Link } from "react-router-dom";
import { Check, ArrowRight, Home } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { EmptyState } from "../components/ui/PageHeading";
export function OrderCompletePage() {
  const { order } = useStore();
  if (!order)
    return (
      <EmptyState
        title="ご注文情報はありません"
        description="ご注文情報はデモ決済の完了後に表示されます。"
      />
    );
  return (
    <div className="container completion-container">
      <CheckoutStepper step={4} />
      <div className="completion-intro">
        <span className="success-icon">
          <Check size={36} strokeWidth={1.2} />
        </span>
        <h1>ご注文ありがとうございます</h1>
        <p>
          デモ注文を受け付けました。
          <br />
          あなたの暮らしに、和の美しさを。
        </p>
        <span className="order-number">注文番号：{order.number}</span>
        <small>注文日：{order.date}</small>
      </div>
      <div className="completion-summary">
        <OrderSummary
          items={order.items}
          subtotal={order.subtotal}
          shipping={order.shipping}
        >
          <div className="completion-payment">
            <span>お支払い方法</span>
            <b>{order.payment}</b>
          </div>
        </OrderSummary>
        <div className="completion-note">
          <h3>こちらはデモ注文です。</h3>
          <p>
            実際の決済、配送、確認メールの送信は行われていません。ご注文情報はこのページを再読み込みすると消去されます。
          </p>
        </div>
      </div>
      <div className="completion-actions">
        <Link className="button button-outline" to="/">
          <Home size={16} />
          ホームに戻る
        </Link>
        <Link className="button" to="/products">
          商品を続けて見る
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
