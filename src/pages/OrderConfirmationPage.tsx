import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { Customer } from "../types/order";
import { useStore } from "../context/StoreContext";
import { validateCustomer } from "../utils/validation";
import {
  CustomerForm,
  PaymentMethodSelector,
} from "../components/checkout/CustomerForm";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { PageHeading, EmptyState } from "../components/ui/PageHeading";
import { CheckoutItems } from "../components/checkout/CheckoutItems";
export function OrderConfirmationPage() {
  const {
    cart,
    subtotal,
    shipping,
    customer,
    setCustomer,
    payment,
    setPayment,
  } = useStore();
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>(
    {},
  );
  const navigate = useNavigate();
  function proceed(e: React.FormEvent) {
    e.preventDefault();
    const next = validateCustomer(customer);
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`customer-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    navigate("/payment");
  }
  return (
    <>
      <PageHeading
        title="注文確認"
        description="お届け先とお支払い方法をご確認ください。"
      />
      <div className="container checkout-container">
        <CheckoutStepper step={2} />
        {cart.length ? (
          <form className="checkout-layout" onSubmit={proceed} noValidate>
            <div>
              <div className="demo-notice">
                <Info size={18} />
                <span>
                  デモ注文です。実際の配送・請求は発生しません。架空の情報でお試しください。
                </span>
              </div>
              <CheckoutItems items={cart} />
              <section className="panel">
                <h2>お届け先情報</h2>
                <CustomerForm
                  customer={customer}
                  onChange={setCustomer}
                  errors={errors}
                />
              </section>
              <Link className="text-link" to="/cart">
                <ArrowLeft size={16} />
                カートに戻る
              </Link>
            </div>
            <OrderSummary items={cart} subtotal={subtotal} shipping={shipping}>
              <section className="summary-payment">
                <h3>お支払い方法</h3>
                <PaymentMethodSelector value={payment} onChange={setPayment} />
                <p className="muted">すべてデモ用のお支払い方法です。</p>
              </section>
              <button className="button full" type="submit">
                注文を確定する
                <ArrowRight size={17} />
              </button>
              <small className="checkout-hint">
                次の画面でデモ決済を行います。
              </small>
            </OrderSummary>
          </form>
        ) : (
          <EmptyState
            title="カートに商品がありません"
            description="商品を選んでから、注文手続きにお進みください。"
          />
        )}
      </div>
    </>
  );
}
