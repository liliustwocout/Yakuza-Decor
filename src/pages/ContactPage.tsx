import { useState } from "react";
import { ArrowRight, Check, MessageCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeading } from "../components/ui/PageHeading";
import { isEmail } from "../utils/validation";
import { useStore } from "../context/StoreContext";
export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const { notify } = useStore();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const key of ["name", "email", "type", "message"] as const)
      if (!form[key].trim()) next[key] = "入力してください。";
    if (form.email && !isEmail(form.email))
      next.email = "正しいメールアドレスを入力してください。";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", type: "", message: "" });
    notify("お問い合わせのデモ送信が完了しました。");
  }
  return (
    <>
      <PageHeading
        title="お問い合わせ"
        description="商品やお買い物について、お気軽にご相談ください。"
      />
      <section className="container section contact-layout">
        <div className="contact-intro">
          <MessageCircle size={35} strokeWidth={1} />
          <h2>
            お手伝いできることは
            <br />
            ありますか。
          </h2>
          <p>
            商品選びやお買い物の流れなど、
            <br />
            ご不明な点をお聞かせください。
          </p>
          <Link className="text-link" to="/guide#faq">
            よくあるご質問を見る
            <ArrowRight size={16} />
          </Link>
          <div className="contact-note">
            <Info size={17} />
            <p>
              このフォームはデモです。メッセージの実際の送信や返信は行われません。
            </p>
          </div>
        </div>
        <div className="panel contact-panel">
          {sent ? (
            <div className="contact-success" role="status">
              <span className="success-icon">
                <Check size={30} />
              </span>
              <h2>デモ送信が完了しました</h2>
              <p>
                お問い合わせの入力内容を確認しました。
                <br />
                内容は外部へ送信・保存されていません。
              </p>
              <button
                className="button button-outline"
                onClick={() => setSent(false)}
              >
                続けて入力する
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2>お問い合わせフォーム</h2>
              {[
                ["name", "お名前", "山田 太郎"],
                ["email", "メールアドレス", "taro@example.com"],
              ].map(([key, label, placeholder]) => (
                <div className="field" key={key}>
                  <label htmlFor={`contact-${key}`}>
                    {label}
                    <span>必須</span>
                  </label>
                  <input
                    id={`contact-${key}`}
                    type={key === "email" ? "email" : "text"}
                    autoComplete={key}
                    value={form[key as "name" | "email"]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    required
                    aria-invalid={!!errors[key]}
                    aria-describedby={
                      errors[key] ? `contact-error-${key}` : undefined
                    }
                  />
                  {errors[key] && (
                    <small className="field-error" id={`contact-error-${key}`}>
                      {errors[key]}
                    </small>
                  )}
                </div>
              ))}
              <div className="field">
                <label htmlFor="contact-type">
                  お問い合わせ種別<span>必須</span>
                </label>
                <select
                  id="contact-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                  aria-invalid={!!errors.type}
                  aria-describedby={
                    errors.type ? "contact-error-type" : undefined
                  }
                >
                  <option value="">選択してください</option>
                  <option>商品について</option>
                  <option>お買い物について</option>
                  <option>3D表示について</option>
                  <option>その他</option>
                </select>
                {errors.type && (
                  <small className="field-error" id="contact-error-type">
                    {errors.type}
                  </small>
                )}
              </div>
              <div className="field">
                <label htmlFor="contact-message">
                  お問い合わせ内容<span>必須</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="お問い合わせ内容をご記入ください。"
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-error-message" : undefined
                  }
                />
                {errors.message && (
                  <small className="field-error" id="contact-error-message">
                    {errors.message}
                  </small>
                )}
              </div>
              <p className="muted">
                実際の個人情報は入力せず、架空の内容でお試しください。
              </p>
              <button className="button full" type="submit">
                デモ送信する
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
