import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Product } from "../../types/product";
export function ProductImage({
  product,
  view = 0,
  className = "",
}: {
  product: Product;
  view?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const x = product.imageIndex % 4,
    y = Math.floor(product.imageIndex / 4);
  // The generated contact sheet has slightly uneven rows; inset each crop to prevent adjoining-photo bleed.
  const rowPositions = [0.6, 48.55, 96.2];
  return (
    <div
      className={`product-image ${className} view-${view}`}
      role="img"
      aria-label={`${product.name}${view === 1 ? "・細部" : view === 2 ? "・拡大" : ""}`}
      style={
        failed
          ? undefined
          : {
              backgroundImage: `url("${product.image}")`,
              backgroundPosition: `${(x * 100) / 3}% ${rowPositions[y]}%`,
            }
      }
    >
      {!failed && (
        <img
          className="image-probe"
          src={product.image}
          alt=""
          onError={() => setFailed(true)}
        />
      )}{" "}
      {failed && (
        <span className="image-fallback">
          <ImageOff />
          <span>{product.name}</span>
          <small>画像を準備中です</small>
        </span>
      )}
    </div>
  );
}
