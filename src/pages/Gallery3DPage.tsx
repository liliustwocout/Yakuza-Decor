import { Link } from "react-router-dom";
import { Box, MousePointer2, ZoomIn, ArrowRight } from "lucide-react";
import { products } from "../data/products";
import { PageHeading } from "../components/ui/PageHeading";
import { ProductImage } from "../components/product/ProductImage";
export function Gallery3DPage() {
  return (
    <>
      <PageHeading
        title="3Dギャラリー"
        description="回して、近づいて。かたちの美しさを、あなたの視点で。"
      />
      <section className="container section">
        <div className="gallery-intro">
          <Box size={35} strokeWidth={1} />
          <div>
            <h2>空間に飾る、その前に。</h2>
            <p>
              模造刀の簡易3Dデモをお試しいただけます。その他の商品も、画像ギャラリーでご覧ください。
            </p>
          </div>
          <div className="viewer-instructions">
            <span>
              <MousePointer2 size={18} />
              ドラッグで回転
            </span>
            <span>
              <ZoomIn size={18} />
              スクロールでズーム
            </span>
          </div>
        </div>
        <div className="gallery-products">
          {products.slice(0, 6).map((p) => (
            <article key={p.id}>
              <Link
                to={`/products/${p.slug}?view=${p.supports3D ? "3d" : "image"}`}
              >
                <ProductImage product={p} />
              </Link>
              <div className="gallery-product-info">
                <span
                  className={`badge ${!p.supports3D ? "badge-neutral" : ""}`}
                >
                  {p.supports3D ? "3Dデモ対応" : "画像ギャラリー"}
                </span>
                <h2>{p.name}</h2>
                <p>
                  {p.supports3D
                    ? "簡易モデルで立体的な形状をお楽しみください。"
                    : "3Dモデルは準備中です。写真をご覧いただけます。"}
                </p>
                <Link
                  className="text-link"
                  to={`/products/${p.slug}?view=${p.supports3D ? "3d" : "image"}`}
                >
                  {p.supports3D ? "3Dで見る" : "商品画像を見る"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
