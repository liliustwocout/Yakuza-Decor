import { Link } from "react-router-dom";
import { Search, Box, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { PageHeading } from "../components/ui/PageHeading";
const faqs = [
  [
    "本当に商品を購入できますか？",
    "このサイトはフロントエンドのデモです。掲載されている商品はサンプルで、実際のご注文・決済・配送は行われません。",
  ],
  [
    "3Dモデルはどのように操作しますか？",
    "「龍の刻 - 模造刀」の「3Dで見る」から、ドラッグで回転、スクロールやピンチで拡大縮小できます。左右キーで回転、＋・－キーでズーム、Homeキーでリセットも可能です。形状確認用の簡易モデルで、実際の意匠とは異なります。",
  ],
  [
    "カートやお気に入りは保存されますか？",
    "このブラウザのlocalStorageに保存されます。再読み込み後もご利用いただけますが、ブラウザの保存データを削除すると消去されます。",
  ],
  [
    "送料はいくらですか？",
    "デモの送料は全国一律800円です。商品小計30,000円以上で送料無料となります。すべての表示価格は税込です。",
  ],
  [
    "個人情報やカード情報は保存されますか？",
    "お届け先は画面を開いている間のみメモリに保持されます。カード情報は固定のサンプル値だけを表示し、入力・送信・保存は行いません。実際の個人情報やカード情報は使用しないでください。",
  ],
  [
    "模造刀には刃が付いていますか？",
    "デモの商品設定では、すべて観賞用の刃なし模造刀です。掲載画像と商品仕様はサンプルとしてご覧ください。",
  ],
];
export function GuidePage() {
  return (
    <>
      <PageHeading
        title="ご利用ガイド"
        description="和の世界を、安心してお楽しみいただくために。"
      />
      <div className="container guide-layout section">
        <nav className="guide-nav" aria-label="ガイド目次">
          {[
            ["shopping", "お買い物の流れ"],
            ["shipping", "配送・送料"],
            ["payment", "お支払い"],
            ["returns", "返品・交換"],
            ["faq", "よくあるご質問"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
              <ArrowRight size={14} />
            </a>
          ))}
        </nav>
        <div className="guide-content">
          <section id="shopping">
            <h2>お買い物の流れ</h2>
            <div className="guide-flow">
              {[
                [
                  Search,
                  "商品を見つける",
                  "商品一覧で検索・カテゴリー絞り込み・並び替えができます。",
                ],
                [
                  Box,
                  "細部を楽しむ",
                  "商品画像や、対応商品の3Dデモをご覧ください。",
                ],
                [
                  ShoppingBag,
                  "カートに入れる",
                  "数量を選んで追加。カート画面で変更や削除もできます。",
                ],
                [
                  CreditCard,
                  "デモ注文を試す",
                  "架空のお届け先を入力し、お支払い方法を選んでデモ決済を完了します。",
                ],
              ].map(([Icon, title, body], i) => {
                const Glyph = Icon as typeof Search;
                return (
                  <article key={String(title)}>
                    <span className="guide-step-number">0{i + 1}</span>
                    <Glyph size={26} strokeWidth={1} />
                    <h3>{String(title)}</h3>
                    <p>{String(body)}</p>
                  </article>
                );
              })}
            </div>
          </section>
          <section id="shipping">
            <h2>配送・送料について</h2>
            <p>
              デモの送料は全国一律800円。商品小計30,000円以上のご注文は送料無料です。
            </p>
            <p>
              実際の配送は行いません。お届け先には架空の情報をご入力ください。
            </p>
          </section>
          <section id="payment">
            <h2>お支払い方法</h2>
            <div className="guide-payments">
              <h3>クレジットカード</h3>
              <p>
                固定のデモカードを表示します。実際のカード情報は入力できません。
              </p>
              <h3>銀行振込</h3>
              <p>デモの支払い方法として選択できます。お振り込みは不要です。</p>
              <h3>代金引換</h3>
              <p>
                デモの支払い方法として選択できます。代金のお支払いは発生しません。
              </p>
            </div>
          </section>
          <section id="returns">
            <h2>返品・交換について</h2>
            <p>
              本サイトはサンプル商品の展示・購入体験を目的としたデモです。実際の商品の発送がないため、返品や交換のお手続きはありません。
            </p>
            <Link className="text-link" to="/contact">
              お問い合わせフォームへ
              <ArrowRight size={15} />
            </Link>
          </section>
          <section id="faq">
            <h2>よくあるご質問</h2>
            <div className="faq-list">
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span>＋</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
          <section id="privacy">
            <h2>プライバシーポリシー</h2>
            <p>
              カートとお気に入りのみをブラウザに保存します。お問い合わせ内容、お届け先、カードの情報を外部サーバーへ送信する機能はありません。ブラウザの保存が利用できない場合は、画面を開いている間のみ状態を保持します。
            </p>
          </section>
          <section id="terms">
            <h2>ご利用規約</h2>
            <p>
              本サイトはYAKUZA
              DECORのフロントエンドMVPです。商品、価格、在庫、仕様はすべてデモ用データです。デモ注文によって売買契約や支払義務は生じません。アカウント登録および実際の決済・配送機能はありません。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
