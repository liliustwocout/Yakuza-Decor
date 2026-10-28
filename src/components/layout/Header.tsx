import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "../ui/Modal";
export const navigation = [
  ["/", "ホーム"],
  ["/products", "商品一覧"],
  ["/gallery", "3Dギャラリー"],
  ["/guide", "ご利用ガイド"],
  ["/contact", "お問い合わせ"],
];
export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="YAKUZA DECOR ホーム">
      <span className="logo-seal">極</span>
      <span>
        <strong>YAKUZA DECOR</strong>
        <small>TRADITION MEETS YOUR SPACE</small>
      </span>
    </Link>
  );
}
export function Header() {
  const { count, favorites } = useStore();
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<"search" | "account" | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="announcement">
        日常に、和の美意識を。<span>30,000円以上のお買い上げで送料無料</span>
        <span className="announcement-end">日本全国へお届け</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="メインナビゲーション">
            {navigation.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="商品を検索"
              onClick={() => setModal("search")}
            >
              <Search />
            </button>
            <Link
              className="icon-button favorite-header"
              to="/favorites"
              aria-label={`お気に入り ${favorites.length}件`}
            >
              <Heart />
              {favorites.length > 0 && <i>{favorites.length}</i>}
            </Link>
            <button
              className="icon-button account-header"
              aria-label="アカウント"
              onClick={() => setModal("account")}
            >
              <UserRound />
            </button>
            <Link
              className="icon-button"
              to="/cart"
              aria-label={`カート ${count}点`}
            >
              <ShoppingBag />
              {count > 0 && <i>{count}</i>}
            </Link>
            <button
              className="icon-button menu-button"
              aria-label={menu ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="mobile-nav" aria-label="モバイルナビゲーション">
            {[...navigation, ["/favorites", "お気に入り"]].map(
              ([to, label]) => (
                <NavLink key={to} to={to} onClick={() => setMenu(false)}>
                  {label}
                  <ArrowRight size={16} />
                </NavLink>
              ),
            )}
          </nav>
        )}
      </header>
      {modal === "search" && (
        <Modal title="商品を探す" onClose={() => setModal(null)}>
          <form
            className="search-modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/products?q=${encodeURIComponent(search)}`);
              setModal(null);
              setSearch("");
            }}
          >
            <label htmlFor="header-search">商品名を入力</label>
            <div className="search-field">
              <Search size={18} />
              <input
                id="header-search"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="刀、鬼の面、和風ランプ…"
              />
              <button className="button" type="submit">
                検索
              </button>
            </div>
          </form>
          <p className="muted">気になる一品を、12点のコレクションから。</p>
        </Modal>
      )}
      {modal === "account" && (
        <Modal title="アカウントについて" onClose={() => setModal(null)}>
          <p>
            このストアはデモサイトです。アカウント登録なしで、お買い物の流れをお試しいただけます。
          </p>
          <p>カートとお気に入りは、このブラウザに保存されます。</p>
          <Link
            className="button"
            to="/favorites"
            onClick={() => setModal(null)}
          >
            お気に入りを見る
            <Heart size={16} />
          </Link>
        </Modal>
      )}
    </>
  );
}
