import { Link } from "react-router-dom";
import { ArrowUpRight, Truck, PackageCheck, ShieldCheck } from "lucide-react";
import { Logo } from "./Header";
export function ServiceStrip() {
  return (
    <div className="service-strip">
      <div>
        <Truck />
        <span>
          30,000円以上で送料無料<small>日本全国へ丁寧にお届け</small>
        </span>
      </div>
      <div>
        <PackageCheck />
        <span>
          大切な一品を、丁寧に梱包<small>専用の梱包で安心のお届け</small>
        </span>
      </div>
      <div>
        <ShieldCheck />
        <span>
          安心して楽しむお買い物<small>お問い合わせもお気軽に</small>
        </span>
      </div>
    </div>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Logo />
          <p>
            伝統と個性が融合した、
            <br />
            特別なインテリアを。
          </p>
          <span className="footer-seal">日本の美を、暮らしの中へ。</span>
        </div>
        <div>
          <h3>コレクション</h3>
          <Link to="/products?category=刀・剣">刀・剣</Link>
          <Link to="/products?category=鬼の面">鬼の面</Link>
          <Link to="/products?category=置物・フィギュア">置物・フィギュア</Link>
          <Link to="/products?category=インテリア雑貨">インテリア雑貨</Link>
          <Link to="/products?category=装飾品">装飾品</Link>
        </div>
        <div>
          <h3>お買い物ガイド</h3>
          <Link to="/guide#shipping">配送・送料について</Link>
          <Link to="/guide#payment">お支払いについて</Link>
          <Link to="/guide#returns">返品・交換について</Link>
          <Link to="/guide#faq">よくあるご質問</Link>
          <Link to="/gallery">3Dギャラリー</Link>
        </div>
        <div className="footer-contact">
          <h3>お問い合わせ</h3>
          <p>
            商品やお買い物について
            <br />
            お気軽にご相談ください。
          </p>
          <Link to="/contact">
            お問い合わせフォーム <ArrowUpRight size={16} />
          </Link>
          <small>こちらはフロントエンドのデモサイトです。</small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} YAKUZA DECOR</span>
        <div>
          <Link to="/guide#privacy">プライバシーポリシー</Link>
          <Link to="/guide#terms">ご利用規約</Link>
        </div>
        <span>和の美意識を、あなたの空間に。</span>
      </div>
    </footer>
  );
}
