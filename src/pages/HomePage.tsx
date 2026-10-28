import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Box } from "lucide-react";
import { categories, products } from "../data/products";
import { ProductGrid } from "../components/product/ProductCard";
import { ProductImage } from "../components/product/ProductImage";
import { ServiceStrip } from "../components/layout/Footer";
import { StoreHero } from "../components/layout/StoreHero";
export function HomePage() {
  return (
    <>
      <StoreHero />
      <ServiceStrip />
      <section className="container section categories-section">
        <div className="section-title">
          <h2>
            和の世界を、探す<span>カテゴリーから選ぶ</span>
          </h2>
          <Link className="text-link" to="/products">
            すべての商品
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link
              className="category-tile"
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
            >
              <ProductImage product={products[[0, 1, 2, 3, 8][i]]} />
              <span>
                <b>{c}</b>
                <ArrowUpRight size={19} />
              </span>
              <i>{String(i + 1).padStart(2, "0")}</i>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section popular-section">
        <div className="section-title">
          <h2>
            心を惹く、逸品<span>人気のコレクション</span>
          </h2>
          <Link className="text-link" to="/products">
            商品一覧を見る
            <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid items={products.filter((p) => p.isFeatured)} />
      </section>
      <section className="limited-section">
        <div className="limited-art">
          <ProductImage product={products[4]} />
          <span className="limited-kanji" aria-hidden="true">
            黒龍
          </span>
        </div>
        <div className="limited-copy">
          <span className="eyebrow">特別なコレクション</span>
          <h2>
            静けさの中に、
            <br />
            揺るぎない存在感。
          </h2>
          <p>
            黒と金が織りなす、武士の美学。
            <br />
            厳選された意匠を、あなたの特別な空間へ。
          </p>
          <Link className="button" to="/products/kokuryu">
            限定商品を見る
            <ArrowRight size={17} />
          </Link>
          <span className="collection-stamp">
            厳選
            <br />
            逸品
          </span>
        </div>
      </section>
      <section className="container section new-section">
        <div className="section-title">
          <h2>
            暮らしに、新しい出会い<span>新着アイテム</span>
          </h2>
          <Link className="text-link" to="/products?sort=new">
            新着商品を見る
            <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid items={products.filter((p) => p.isNew)} />
      </section>
      <section className="container gallery-banner">
        <div className="gallery-banner-title">
          <Box size={32} strokeWidth={1} />
          <h2>その美しさを、あらゆる角度から。</h2>
        </div>
        <p>回して、近づいて。3Dで出会う、新しいお買い物体験。</p>
        <Link className="text-link" to="/gallery">
          3Dギャラリーを見る
          <ArrowRight size={17} />
        </Link>
      </section>
      <section className="brand-story container">
        <span className="story-seal">極</span>
        <div>
          <h2>飾るのは、ものだけじゃない。</h2>
          <p>
            日本の伝統が育んだ、かたちと美意識。
            <br />
            YAKUZA DECORは、その魅力を今の暮らしへ届けます。
            <br />
            あなたらしさを語る一品を、ここで。
          </p>
        </div>
        <span className="story-vertical">伝統と個性が、出会う場所。</span>
      </section>
    </>
  );
}
