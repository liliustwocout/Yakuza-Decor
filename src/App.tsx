import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { EmptyState } from "./components/ui/PageHeading";
import { useStore } from "./context/StoreContext";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { Gallery3DPage } from "./pages/Gallery3DPage";
import { CartPage } from "./pages/CartPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { PaymentPage } from "./pages/PaymentPage";
import { OrderCompletePage } from "./pages/OrderCompletePage";
import { GuidePage } from "./pages/GuidePage";
import { ContactPage } from "./pages/ContactPage";
const titles: Record<string, string> = {
  "/": "ホーム",
  "/products": "商品一覧",
  "/favorites": "お気に入り",
  "/gallery": "3Dギャラリー",
  "/cart": "ショッピングカート",
  "/checkout": "注文確認",
  "/payment": "決済",
  "/order-complete": "注文完了",
  "/guide": "ご利用ガイド",
  "/contact": "お問い合わせ",
};
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    document.title = `${titles[pathname] ?? (pathname.startsWith("/products/") ? "商品詳細" : "ページが見つかりません")} | YAKUZA DECOR`;
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
    if (previous.current !== pathname) {
      document.getElementById("main")?.focus({ preventScroll: true });
      previous.current = pathname;
    }
  }, [pathname, hash]);
  return null;
}
export function App() {
  const { toast, setToast, storageWarning } = useStore();
  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <RouteEffects />
      <Header />
      {storageWarning && (
        <div className="storage-warning" role="status">
          ブラウザへの保存が利用できません。カートとお気に入りは、この画面を開いている間のみ保持されます。
        </div>
      )}
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route
            path="/favorites"
            element={<ProductListPage favoritesOnly />}
          />
          <Route path="/gallery" element={<Gallery3DPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<OrderConfirmationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-complete" element={<OrderCompletePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="*"
            element={
              <EmptyState
                title="ページが見つかりません"
                description="URLをご確認いただくか、商品一覧からお楽しみください。"
              />
            }
          />
        </Routes>
      </main>
      <Footer />
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={17} />
          </span>
          <p>{toast}</p>
          <button
            className="icon-button"
            aria-label="通知を閉じる"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
