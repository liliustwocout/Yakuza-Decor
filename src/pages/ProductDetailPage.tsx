import { lazy, Suspense, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronRight,
  Box,
  ImageIcon,
  Check,
} from "lucide-react";
import { products } from "../data/products";
import { useStore } from "../context/StoreContext";
import { yen } from "../utils/currency";
import { ProductImage } from "../components/product/ProductImage";
import { ProductGrid } from "../components/product/ProductCard";
import { QuantitySelector } from "../components/product/QuantitySelector";
import { EmptyState, PageHeading } from "../components/ui/PageHeading";
const Product3DViewer = lazy(
  () => import("../components/product/Product3DViewer"),
);
export function ProductDetailPage() {
  const { slug } = useParams();
  const p = products.find((p) => p.slug === slug);
  if (!p)
    return (
      <EmptyState
        title="商品が見つかりません"
        description="お探しの商品は見つかりませんでした。商品一覧からお選びください。"
      />
    );
  return <ProductDetail key={p.id} product={p} />;
}
function ProductDetail({ product: p }: { product: (typeof products)[number] }) {
  const { add, favorites, toggleFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState("description");
  const navigate = useNavigate();
  const is3D = params.get("view") === "3d";
  const favorite = favorites.includes(p.id);
  function setView(value: string) {
    setParams(value === "3d" ? { view: "3d" } : {});
  }
  return (
    <>
      <PageHeading
        title="商品詳細"
        description="伝統の美を、あなたの空間に。"
      />
      <div className="container detail-breadcrumb breadcrumbs">
        <Link to="/">ホーム</Link>
        <ChevronRight size={12} />
        <Link to="/products">商品一覧</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${encodeURIComponent(p.category)}`}>
          {p.category}
        </Link>
        <ChevronRight size={12} />
        <span>{p.name}</span>
      </div>
      <section className="container product-detail">
        <div className="detail-gallery">
          <div className="gallery-tabs">
            <button
              className={!is3D ? "active" : ""}
              onClick={() => setView("image")}
            >
              <ImageIcon size={16} />
              商品画像
            </button>
            <button
              className={is3D ? "active" : ""}
              onClick={() => setView("3d")}
            >
              <Box size={16} />
              {p.supports3D ? "3Dで見る" : "3D表示について"}
            </button>
          </div>
          {is3D ? (
            p.supports3D ? (
              <Suspense
                fallback={
                  <div className="viewer-loading">
                    3Dモデルを読み込んでいます…
                  </div>
                }
              >
                <Product3DViewer />
              </Suspense>
            ) : (
              <div className="unavailable-3d">
                <ProductImage product={p} />
                <div>
                  <Box />
                  <h3>この商品の3Dモデルは準備中です。</h3>
                  <p>商品画像で質感やディテールをご確認ください。</p>
                  <button
                    className="button button-outline"
                    onClick={() => setView("image")}
                  >
                    商品画像を見る
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              <div className="detail-main-image">
                <ProductImage product={p} view={photo} />
                <span className="gallery-image-label">
                  {["全体", "ディテール", "質感"][photo]}
                </span>
              </div>
              <div className="gallery-thumbnails">
                {p.gallery.map((_, i) => (
                  <button
                    key={i}
                    className={photo === i ? "selected" : ""}
                    aria-label={`商品画像 ${i + 1}：${["全体", "ディテール", "質感"][i]}`}
                    aria-pressed={photo === i}
                    onClick={() => setPhoto(i)}
                  >
                    <ProductImage product={p} view={i} />
                  </button>
                ))}
              </div>
              <p className="gallery-photo-note">
                細部は同じ写真の拡大表示です。
              </p>
            </>
          )}
        </div>
        <div className="detail-info">
          <div className="detail-eyebrow">
            {p.category}
            <span>{p.isNew ? "新着アイテム" : "厳選コレクション"}</span>
          </div>
          <h1>{p.name}</h1>
          <span className="detail-price">
            {yen(p.price)}
            <small>税込</small>
          </span>
          <p className="detail-description">{p.description}</p>
          <p className={`stock ${!p.stock ? "out-of-stock" : ""}`}>
            <span />
            {p.stock ? `在庫あり（残り${p.stock}点）` : "在庫切れ"}
          </p>
          <div className="detail-quantity">
            <span>数量</span>
            <QuantitySelector
              value={quantity}
              max={p.stock}
              onChange={setQuantity}
            />
            <button
              className={`favorite-detail icon-button ${favorite ? "is-favorite" : ""}`}
              aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
              aria-pressed={favorite}
              onClick={() => toggleFavorite(p.id)}
            >
              <Heart fill={favorite ? "currentColor" : "none"} size={20} />
            </button>
          </div>
          <button
            className="button full"
            disabled={!p.stock}
            onClick={() => add(p.id, quantity)}
          >
            <ShoppingBag size={18} />
            {p.stock ? "カートに入れる" : "在庫切れ"}
          </button>
          <button
            className="button button-dark full"
            disabled={!p.stock}
            onClick={() => {
              add(p.id, quantity);
              navigate("/checkout");
            }}
          >
            今すぐ購入
          </button>
          <div className="detail-promises">
            <span>
              <Truck size={20} />
              30,000円以上で送料無料
            </span>
            <span>
              <ShieldCheck size={20} />
              丁寧な梱包でお届け
            </span>
          </div>
          <p className="detail-demo-note">
            掲載商品・在庫・仕様はデモ用のサンプルです。
          </p>
        </div>
      </section>
      <section className="container product-information">
        <div className="information-tabs" role="tablist" aria-label="商品情報">
          {[
            ["description", "商品説明"],
            ["specifications", "仕様"],
            ["delivery", "配送・お取り扱い"],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="information-content"
        >
          {tab === "description" ? (
            <>
              <h3>暮らしに、和の美しさを。</h3>
              <p>{p.description}</p>
              <p>
                <Check size={16} /> インテリアやコレクションにおすすめです。
              </p>
              <p>
                画像はイメージです。色味や細部は実際の商品と異なる場合があります。
              </p>
            </>
          ) : tab === "specifications" ? (
            <dl className="specifications">
              {Object.entries(p.specifications).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <>
              <h3>大切な一品を、丁寧にお届けします。</h3>
              <p>
                送料は全国一律800円。30,000円以上のお買い上げで送料無料です。
              </p>
              <p>
                模造刀や装飾品は観賞用です。お子様の手の届かない安定した場所に飾ってください。
              </p>
              <Link className="text-link" to="/guide#returns">
                返品・交換について
                <ChevronRight size={15} />
              </Link>
            </>
          )}
        </div>
      </section>
      <section className="container section">
        <div className="section-title">
          <h2>
            こちらもおすすめ<span>関連アイテム</span>
          </h2>
          <Link className="text-link" to="/products">
            商品一覧へ
            <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid
          items={products
            .filter((x) => x.id !== p.id)
            .sort(
              (a, b) =>
                Number(b.category === p.category) -
                Number(a.category === p.category),
            )
            .slice(0, 4)}
        />
      </section>
    </>
  );
}
