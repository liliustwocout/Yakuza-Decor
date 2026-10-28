import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "../../types/product";
import { useStore } from "../../context/StoreContext";
import { ProductImage } from "./ProductImage";
import { yen } from "../../utils/currency";
export function ProductCard({ product: p }: { product: Product }) {
  const { favorites, toggleFavorite, add } = useStore();
  const favorite = favorites.includes(p.id);
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link to={`/products/${p.slug}`} aria-label={`${p.name}の詳細を見る`}>
          <ProductImage product={p} />
        </Link>
        <div className="badges">
          {p.isNew && <span className="badge">新着</span>}
          {p.supports3D && <span className="badge badge-dark">3D対応</span>}
          {!p.stock && <span className="badge badge-dark">在庫切れ</span>}
        </div>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={`${p.name}を${favorite ? "お気に入りから削除" : "お気に入りに追加"}`}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(p.id)}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-card-info">
        <small>{p.category}</small>
        <Link className="product-name" to={`/products/${p.slug}`}>
          {p.name}
        </Link>
        <div className="product-price-row">
          <span className="product-price">
            {yen(p.price)}
            <small>税込</small>
          </span>
        </div>
        <div className="product-card-actions">
          <Link className="button card-detail" to={`/products/${p.slug}`}>
            詳細を見る
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="card-add"
            disabled={!p.stock}
            aria-label={`${p.name}をカートに追加`}
            onClick={() => add(p.id)}
          >
            <ShoppingBag size={21} />
          </button>
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="product-grid">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
