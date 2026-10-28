import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "../../data/products";

export function StoreHero({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`hero ${compact ? "hero-compact" : ""}`}
      style={{ backgroundImage: `url(${assets.hero})` }}
    >
      <div className="container hero-inner">
        <div className="hero-copy">
          {!compact && (
            <span className="eyebrow">
              <span />
              日本の美を、日常に。
            </span>
          )}
          {compact ? (
            <h2>
              ヤクザの<span>美</span>、<br />
              あなたの空間に
            </h2>
          ) : (
            <h1>
              ヤクザの<span>美</span>、<br />
              あなたの空間に
            </h1>
          )}
          <p>伝統と個性が融合した、特別なインテリアを。</p>
          {!compact && (
            <Link to="/products" className="button hero-button">
              商品を見る
              <ArrowRight size={21} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
