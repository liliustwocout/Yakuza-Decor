import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function fillCustomer(page: Page) {
  for (const [key, value] of Object.entries({
    name: "山田 デモ",
    email: "demo@example.com",
    phone: "09012345678",
    postal: "1000001",
    prefecture: "東京都",
    city: "千代田区",
    address: "1-1 デモハイツ101",
  }))
    await page.locator(`#customer-${key}`).fill(value);
}
async function addKatana(page: Page) {
  await page.goto("/products/ryu-no-toki");
  await page
    .getByRole("button", { name: "カートに入れる", exact: true })
    .click();
}

test("complete shopping journey, validation, correct totals, and cart clearing", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "あなたの空間に",
  );
  await page
    .getByRole("link", { name: "商品を見る", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/products$/);
  await page.getByRole("button", { name: "刀・剣 2" }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("textbox", { name: "商品名で検索" }).fill("龍の刻");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: "龍の刻 - 模造刀の詳細を見る", exact: true })
    .click();
  await page.getByRole("button", { name: "数量を増やす", exact: true }).click();
  await expect(page.locator("output")).toHaveText("2");
  await page
    .getByRole("button", { name: "カートに入れる", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "カート 2点", exact: true }),
  ).toBeVisible();
  await page.goto("/products/andon");
  await page
    .getByRole("button", { name: "カートに入れる", exact: true })
    .click();
  await page.getByRole("link", { name: "カート 3点", exact: true }).click();
  await expect(page.locator(".grand-total")).toContainText("¥103,000");
  await page
    .getByRole("button", { name: "和風ランプの数量を増やす", exact: true })
    .click();
  await expect(page.locator(".grand-total")).toContainText("¥116,000");
  await page.reload();
  await expect(
    page.getByRole("link", { name: "カート 4点", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "注文確認に進む" }).click();
  await page.getByRole("button", { name: "注文を確定する" }).click();
  await expect(page.locator(".field-error")).toHaveCount(7);
  await expect(page).toHaveURL(/checkout/);
  await fillCustomer(page);
  await page.getByRole("button", { name: "注文を確定する" }).click();
  await expect(page).toHaveURL(/payment/);
  await expect(page.getByLabel("カード番号", { exact: true })).toHaveAttribute(
    "readonly",
    "",
  );
  await page.getByRole("button", { name: "¥116,000のデモ決済を完了" }).click();
  await expect(page.getByRole("alert")).toContainText("チェックを入れて");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "¥116,000のデモ決済を完了" }).click();
  await expect(
    page.getByRole("heading", { name: "ご注文ありがとうございます" }),
  ).toBeVisible();
  await expect(page.locator(".grand-total")).toContainText("¥116,000");
  await expect(page.locator(".order-number")).toContainText("YD-");
  await expect(
    page.getByRole("link", { name: "カート 0点", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("yakuza-cart"))).toBe(
    "[]",
  );
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(stored).not.toContain("demo@example");
  expect(stored).not.toContain("4242");
  await page.getByRole("link", { name: "商品を続けて見る" }).click();
  await expect(page).toHaveURL(/products/);
  expect(errors).toEqual([]);
});

test("favorites persist and can be removed from saved collection", async ({
  page,
}) => {
  await page.goto("/products");
  await page
    .getByRole("button", { name: "般若の面をお気に入りに追加", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "般若の面をお気に入りから削除",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "お気に入り 1件", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "般若の面をお気に入りから削除", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "お気に入りはまだありません" }),
  ).toBeVisible();
});

test("search, empty result, price sorting, new sorting and load more", async ({
  page,
}) => {
  await page.goto("/products");
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.getByRole("button", { name: "もっと見る", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(12);
  await page
    .getByRole("combobox", { name: "並び替え" })
    .selectOption("price-asc");
  await expect(page.locator(".product-card .product-name").first()).toHaveText(
    "日本風の香炉",
  );
  await page
    .getByRole("combobox", { name: "並び替え" })
    .selectOption("price-desc");
  await expect(page.locator(".product-card .product-name").first()).toHaveText(
    "黒龍の刀セット",
  );
  await page.getByRole("combobox", { name: "並び替え" }).selectOption("new");
  await expect(
    page.locator(".product-card").first().getByText("新着", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "商品名で検索" })
    .fill("存在しない商品");
  await expect(
    page.getByRole("heading", { name: "該当する商品が見つかりません" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await expect(page.locator(".product-card")).toHaveCount(8);
});

test("cart deletion dialog, quantity bounds and shipping fee", async ({
  page,
}) => {
  await page.goto("/products/andon");
  await page
    .getByRole("button", { name: "カートに入れる", exact: true })
    .click();
  await page.goto("/cart");
  await expect(page.locator(".grand-total")).toContainText("¥13,800");
  await expect(
    page.getByRole("button", { name: "和風ランプの数量を減らす", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "和風ランプを削除", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "キャンセル", exact: true }).click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await page
    .getByRole("button", { name: "和風ランプを削除", exact: true })
    .click();
  await page.getByRole("button", { name: "削除する", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "カートに商品がありません" }),
  ).toBeVisible();
  await page.goto("/products/incense");
  await expect(
    page.getByRole("button", { name: "在庫切れ", exact: true }),
  ).toBeDisabled();
});

test("unknown pages, protected checkout and browser history", async ({
  page,
}) => {
  await page.goto("/products/not-a-product");
  await expect(
    page.getByRole("heading", { name: "商品が見つかりません" }),
  ).toBeVisible();
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { name: "ページが見つかりません" }),
  ).toBeVisible();
  await page.goto("/payment");
  await expect(
    page.getByRole("heading", { name: "カートに商品がありません" }),
  ).toBeVisible();
  await addKatana(page);
  await page.goto("/payment");
  await expect(
    page.getByRole("heading", { name: "お届け先情報を入力してください" }),
  ).toBeVisible();
  await page.goto("/");
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "商品一覧", exact: true })
    .click();
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "ご利用ガイド", exact: true })
    .click();
  await page.goBack();
  await expect(page).toHaveURL(/products/);
  await page.goForward();
  await expect(page).toHaveURL(/guide/);
});

test("contact form validates and only simulates submission", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "デモ送信する" }).click();
  await expect(page.locator(".field-error")).toHaveCount(4);
  await page.getByLabel("お名前", { exact: false }).fill("山田 デモ");
  await page.getByLabel("メールアドレス", { exact: false }).fill("bad-mail");
  await page
    .getByLabel("お問い合わせ種別", { exact: false })
    .selectOption("商品について");
  await page
    .getByLabel("お問い合わせ内容", { exact: false })
    .fill("これはテストのお問い合わせです。");
  await page.getByRole("button", { name: "デモ送信する" }).click();
  await expect(page.locator(".field-error")).toContainText(
    "正しいメールアドレス",
  );
  await page
    .getByLabel("メールアドレス", { exact: false })
    .fill("test@example.com");
  await page.getByRole("button", { name: "デモ送信する" }).click();
  await expect(
    page.getByRole("heading", { name: "デモ送信が完了しました" }),
  ).toBeVisible();
});

test("real 3D canvas rotates, zooms and resets; missing models offer fallback", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/products/ryu-no-toki?view=3d");
  await expect(page.locator(".viewer-canvas canvas")).toBeVisible();
  const before = await page.locator(".viewer-canvas").screenshot();
  await page.getByRole("button", { name: "モデルを回転", exact: true }).click();
  const after = await page.locator(".viewer-canvas").screenshot();
  expect(before.equals(after)).toBe(false);
  await page.getByRole("button", { name: "モデルを拡大", exact: true }).click();
  await page.getByRole("button", { name: "リセット", exact: true }).click();
  await page.locator(".viewer-canvas").focus();
  await page.keyboard.press("ArrowRight");
  await page.screenshot({ path: "test-results/gallery-desktop.png" });
  await page.goto("/products/hannya?view=3d");
  await expect(
    page.getByRole("heading", { name: "この商品の3Dモデルは準備中です。" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "商品画像を見る", exact: true })
    .click();
  await expect(page.locator(".detail-main-image")).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile menu, filter, search dialog and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "メニューを開く", exact: true })
    .click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "商品一覧", exact: true })
    .click();
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
  await page.getByRole("button", { name: "カテゴリー", exact: true }).click();
  await page.getByRole("button", { name: "鬼の面 2" }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.screenshot({
    path: "test-results/catalog-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "商品を検索", exact: true }).click();
  await page.getByLabel("商品名を入力").fill("和風ランプ");
  await page.getByRole("button", { name: "検索", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
});

test("all main routes render and desktop layout is captured", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const url of [
    "/",
    "/products",
    "/products/ryu-no-toki",
    "/gallery",
    "/cart",
    "/checkout",
    "/payment",
    "/order-complete",
    "/guide",
    "/contact",
    "/favorites",
  ]) {
    await page.goto(url);
    await expect(page.locator("main")).not.toBeEmpty();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto("/products");
  expect(
    await page
      .locator(".product-name")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  expect(
    await page
      .locator(".desktop-nav a")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(14);
  await expect(
    page.locator(".product-card .card-detail").first(),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/catalog-desktop.png",
    fullPage: true,
  });
  await page.screenshot({ path: "test-results/catalog-desktop-viewport.png" });
  expect(errors).toEqual([]);
});

test("corrupt or stale persisted data does not crash the storefront", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "yakuza-cart",
      JSON.stringify([
        { productId: "yd-001", quantity: 999 },
        { productId: "yd-999", quantity: 5 },
        { productId: "yd-002", quantity: -1 },
      ]),
    );
    localStorage.setItem("yakuza-favorites", "broken-json");
  });
  await page.goto("/cart");
  await expect(
    page.getByRole("link", { name: "カート 8点", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(
    page.getByRole("button", {
      name: "龍の刻 - 模造刀の数量を増やす",
      exact: true,
    }),
  ).toBeDisabled();
});

for (const method of ["銀行振込", "代金引換"])
  test(`${method} simulated payment completes`, async ({ page }) => {
    await addKatana(page);
    await page.goto("/checkout");
    await fillCustomer(page);
    await page.getByRole("radio", { name: method, exact: true }).check();
    await page.getByRole("button", { name: "注文を確定する" }).click();
    await expect(page.locator(".payment-info")).toContainText(method);
    await expect(page.locator("#demo-card-0")).toHaveCount(0);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "¥45,000のデモ決済を完了" }).click();
    await expect(page.locator(".completion-payment")).toContainText(method);
  });

test("broken product images and blocked storage have graceful fallbacks", async ({
  page,
}) => {
  await page.route("**/images/products.png", (route) => route.abort());
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.goto("/products/ryu-no-toki");
  await expect(
    page.locator(".detail-main-image .image-fallback"),
  ).toBeVisible();
  await expect(page.locator(".storage-warning")).toContainText(
    "ブラウザへの保存が利用できません",
  );
  await page
    .getByRole("button", { name: "カートに入れる", exact: true })
    .click();
  await page.getByRole("link", { name: "カート 1点", exact: true }).click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.locator(".grand-total")).toContainText("¥45,000");
});

test("small phones and tablets keep every page within the viewport", async ({
  page,
}) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of [
      "/",
      "/products",
      "/products/ryu-no-toki",
      "/gallery",
      "/guide",
      "/contact",
    ]) {
      await page.goto(url);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}px ${url}`,
      ).toBe(true);
    }
  }
});

test("checkout rejects malformed fields and allows editing before payment", async ({
  page,
}) => {
  await addKatana(page);
  await page.goto("/checkout");
  await fillCustomer(page);
  await page.locator("#customer-email").fill("bad-email");
  await page.locator("#customer-postal").fill("123");
  await page.locator("#customer-phone").fill("abc");
  await page.getByRole("button", { name: "注文を確定する" }).click();
  await expect(page.locator(".field-error")).toHaveCount(3);
  await fillCustomer(page);
  await page.screenshot({
    path: "test-results/checkout-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "注文を確定する" }).click();
  await page.getByRole("link", { name: "変更する", exact: true }).click();
  await expect(page.locator("#customer-name")).toHaveValue("山田 デモ");
  await page.locator("#customer-name").fill("変更 デモ");
  await page.getByRole("button", { name: "注文を確定する" }).click();
  await expect(page.locator(".customer-review")).toContainText("変更 デモ");
  await page.screenshot({
    path: "test-results/payment-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/payment-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator("#demo-card-0")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});
