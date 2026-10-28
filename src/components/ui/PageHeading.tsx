import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
export function PageHeading({
  title,
  description,
  variant = "dark",
}: {
  title: string;
  description?: string;
  variant?: "dark" | "paper";
}) {
  return (
    <section className={`page-heading page-heading-${variant}`}>
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">ホーム</Link>
          <ChevronRight size={12} />
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <span className="heading-kanji" aria-hidden="true">
          和
        </span>
      </div>
    </section>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-seal">空</span>
      <h2>{title}</h2>
      <p>{description ?? "お気に入りの一品を、見つけにいきませんか。"}</p>
      <Link className="button" to="/products">
        商品を見る
      </Link>
    </div>
  );
}
