import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { products, categories } from "../data/products";
import { useStore } from "../context/StoreContext";
import { ProductGrid } from "../components/product/ProductCard";
import { PageHeading, EmptyState } from "../components/ui/PageHeading";
import { StoreHero } from "../components/layout/StoreHero";
import { ProductImage } from "../components/product/ProductImage";
export function ProductListPage({
  favoritesOnly = false,
}: {
  favoritesOnly?: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(8);
  const [filters, setFilters] = useState(false);
  const { favorites } = useStore();
  const query = params.get("q") ?? "",
    category = params.get("category") ?? "",
    sort = params.get("sort") ?? "recommended";
  function change(key: string, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
    setLimit(8);
  }
  const filtered = products.filter(
    (p) =>
      (!favoritesOnly || favorites.includes(p.id)) &&
      (!category || p.category === category) &&
      p.name
        .normalize("NFKC")
        .toLowerCase()
        .includes(query.trim().normalize("NFKC").toLowerCase()),
  );
  filtered.sort((a, b) =>
    sort === "price-asc"
      ? a.price - b.price
      : sort === "price-desc"
        ? b.price - a.price
        : sort === "new"
          ? Number(b.isNew) - Number(a.isNew)
          : Number(b.isFeatured) - Number(a.isFeatured),
  );
  return (
    <>
      {favoritesOnly ? (
        <PageHeading
          title={favoritesOnly ? "お気に入り" : "商品一覧"}
          description={
            favoritesOnly
              ? "心にとまった一品を、いつでもここから。"
              : "暮らしに、凛とした個性を。あなただけの一品をお選びください。"
          }
        />
      ) : (
        <StoreHero compact />
      )}
      <div className="container catalog-layout section">
        <aside className={`catalog-sidebar ${filters ? "filters-open" : ""}`}>
          <h2>カテゴリー</h2>
          <div className="category-filters">
            {["すべての商品", ...categories].map((c, i) => (
              <button
                key={c}
                className={category === (i === 0 ? "" : c) ? "selected" : ""}
                onClick={() => {
                  change("category", i === 0 ? "" : c);
                  setFilters(false);
                }}
              >
                <span className="filter-category-picture" aria-hidden="true">
                  <ProductImage
                    product={products[i === 0 ? 4 : [0, 1, 2, 3, 8][i - 1]]}
                  />
                </span>
                <span>{c}</span>
                <small>
                  {
                    products.filter(
                      (p) =>
                        (!favoritesOnly || favorites.includes(p.id)) &&
                        (i === 0 || p.category === c),
                    ).length
                  }
                </small>
              </button>
            ))}
          </div>
          <Link to="/products/kokuryu" className="sidebar-note">
            <span>限定商品</span>
            <p>今だけの特別なアイテム</p>
            <span className="sidebar-cta">
              今すぐチェック
              <ArrowRight size={18} />
            </span>
          </Link>
        </aside>
        <div className="catalog-main">
          <h1 className="catalog-title">
            {favoritesOnly ? "お気に入り" : "商品一覧"}
          </h1>
          <div className="catalog-toolbar">
            <div className="search-field">
              <Search size={17} />
              <input
                aria-label="商品名で検索"
                value={query}
                onChange={(e) => change("q", e.target.value)}
                placeholder="商品名で検索"
              />
              {query && (
                <button
                  className="icon-button"
                  aria-label="検索をクリア"
                  onClick={() => change("q", "")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className="filter-toggle button button-outline"
              aria-expanded={filters}
              onClick={() => setFilters(!filters)}
            >
              <SlidersHorizontal size={16} />
              カテゴリー
            </button>
            <label className="sort-select">
              <span className="sr-only">並び替え</span>
              <select
                value={sort}
                onChange={(e) => change("sort", e.target.value)}
              >
                <option value="recommended">おすすめ順</option>
                <option value="new">新着順</option>
                <option value="price-asc">価格が安い順</option>
                <option value="price-desc">価格が高い順</option>
              </select>
            </label>
          </div>
          <div className="results-line">
            <span>
              {filtered.length} 件の商品{category && ` / ${category}`}
            </span>
            {(query || category) && (
              <button
                className="plain-button"
                onClick={() => {
                  setParams(sort !== "recommended" ? { sort } : {});
                  setLimit(8);
                }}
              >
                条件をクリア
                <X size={13} />
              </button>
            )}
          </div>
          {filtered.length ? (
            <>
              <ProductGrid items={filtered.slice(0, limit)} />
              {limit < filtered.length && (
                <div className="load-more">
                  <p>
                    {filtered.length}件中 {Math.min(limit, filtered.length)}
                    件を表示
                  </p>
                  <button
                    className="button button-outline"
                    onClick={() => setLimit((l) => l + 8)}
                  >
                    もっと見る
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title={
                favoritesOnly && !favorites.length
                  ? "お気に入りはまだありません"
                  : "該当する商品が見つかりません"
              }
              description={
                favoritesOnly && !favorites.length
                  ? "商品のハートマークから、気になる一品を保存できます。"
                  : "検索キーワードやカテゴリーを変更してお試しください。"
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
