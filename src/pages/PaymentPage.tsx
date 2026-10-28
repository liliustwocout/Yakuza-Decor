import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Info, LockKeyhole, Pencil } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { validateCustomer } from "../utils/validation";
import { yen } from "../utils/currency";
import { PaymentMethodSelector } from "../components/checkout/CustomerForm";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { PageHeading, EmptyState } from "../components/ui/PageHeading";
export function PaymentPage() {
  const { cart, subtotal, shipping, customer, payment, setPayment, complete } =
    useStore();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const validCustomer = Object.keys(validateCustomer(customer)).length === 0;
  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("デモ決済についてご確認のうえ、チェックを入れてください。");
      return;
    }
    if (!validCustomer) {
      setError("お届け先情報を入力してください。");
      return;
    }
    complete();
    navigate("/order-complete", { replace: true });
  };
  return (
    <>
      <PageHeading
        variant="paper"
        title="決済"
        description="ご注文内容とお支払い情報をご確認ください。"
      />
      <div className="container checkout-container">
        <CheckoutStepper step={3} />
        {!cart.length ? (
          <EmptyState title="カートに商品がありません" />
        ) : !validCustomer ? (
          <div className="empty-state">
            <h2>お届け先情報を入力してください</h2>
            <p>ご注文手続きを続けるには、お届け先の入力が必要です。</p>
            <Link className="button" to="/checkout">
              注文確認に戻る
            </Link>
          </div>
        ) : (
          <form className="checkout-layout" onSubmit={pay} noValidate>
            <div>
              <div className="demo-notice">
                <Info size={18} />
                <span>
                  フロントエンドのデモ決済です。実際のカード情報は入力しないでください。
                </span>
              </div>
              <section className="panel">
                <div className="panel-title">
                  <h2>お届け先</h2>
                  <Link className="text-link" to="/checkout">
                    変更する
                    <Pencil size={14} />
                  </Link>
                </div>
                <div className="customer-review">
                  <strong>{customer.name} 様</strong>
                  <p>
                    〒{customer.postal}
                    <br />
                    {customer.prefecture}
                    {customer.city}
                    {customer.address}
                  </p>
                  <span>{customer.email}</span>
                  <span>{customer.phone}</span>
                </div>
              </section>
              <section className="panel">
                <h2>お支払い方法</h2>
                <PaymentMethodSelector value={payment} onChange={setPayment} />
                {payment === "クレジットカード" ? (
                  <div className="mock-card">
                    <div className="mock-card-heading">
                      <CreditCard size={22} />
                      <b>デモカード</b>
                      <small>入力不要・実際の請求なし</small>
                    </div>
                    <p>
                      以下は固定のサンプル情報です。実際のカード情報は使用しません。
                    </p>
                    <div className="mock-card-fields">
                      {[
                        ["カード番号", "4242 4242 4242 4242"],
                        ["カード名義人", "TARO DEMO"],
                        ["有効期限", "12 / 30"],
                        ["セキュリティコード", "123"],
                      ].map(([label, value], i) => (
                        <div className="field" key={label}>
                          <label htmlFor={`demo-card-${i}`}>{label}</label>
                          <input
                            id={`demo-card-${i}`}
                            readOnly
                            value={value}
                            tabIndex={-1}
                          />
                        </div>
                      ))}
                    </div>
                    <small>
                      <LockKeyhole size={12} />
                      この情報の送信・保存は行いません。
                    </small>
                  </div>
                ) : (
                  <div className="payment-info">
                    {payment === "銀行振込"
                      ? "銀行振込を選択しました。デモのため、振込先の案内や実際のご入金はありません。"
                      : "代金引換を選択しました。デモのため、商品のお届けや代金のお支払いはありません。"}
                  </div>
                )}
              </section>
              <Link className="text-link" to="/checkout">
                <ArrowLeft size={16} />
                注文内容を変更する
              </Link>
            </div>
            <OrderSummary items={cart} subtotal={subtotal} shipping={shipping}>
              <label className="agreement">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setError("");
                  }}
                  aria-describedby={error ? "payment-error" : undefined}
                />
                <span>
                  <Link to="/guide#terms" target="_blank" rel="noreferrer">
                    ご利用規約
                  </Link>
                  と、実際の決済が発生しないデモであることを確認しました。
                </span>
              </label>
              {error && (
                <p className="field-error" id="payment-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button full payment-submit" type="submit">
                <LockKeyhole size={17} />
                {yen(subtotal + shipping)}のデモ決済を完了
              </button>
              <small className="checkout-hint">
                請求・発送は行われません。
              </small>
            </OrderSummary>
          </form>
        )}
      </div>
    </>
  );
}
