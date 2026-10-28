# YAKUZA DECOR

A Japanese-language, frontend-only ecommerce MVP built with React 19, TypeScript, Vite, React Router, Lucide, and Three.js. No backend, database, APIs, payment service, or account service is used.

The revised visual system follows the supplied `design-references/` images: paper surfaces with restrained sakura edges, a brush-style wordmark, samurai/katana catalog hero, temple banners for detail and order review, and visible crimson card actions. Main content uses 16–18px text, secondary labels approximately 14–15px, product names 18–19px on desktop, and prominent product prices. `src/reference-design.css` contains the reference-specific layout and responsive refinements; base typography is defined in `src/styles.css`.

## Run

Requires Node.js 22.12+ (or a compatible newer LTS).

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, normally http://127.0.0.1:5173.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
npm run test:e2e
```

Browser tests use locally installed Google Chrome. To use Playwright's bundled Chromium instead, remove `channel: 'chrome'` from `playwright.config.ts`, then run `npx playwright install chromium`. Tests start Vite automatically or reuse an existing server on port 5173. The deployment output is `dist/`; static hosting must rewrite unknown paths to `index.html` for client-side routing.

## Routes

- `/` — home, categories, popular products, new arrivals, brand story
- `/products` — search, category filter, sorting, load more
- `/products/:slug` — gallery, quantities, favorites, specifications, related products
- `/gallery` — 3D availability and gallery links
- `/favorites` — saved products
- `/cart` — quantity changes, removal confirmation, totals, shipping
- `/checkout` — order review, customer and shipping form, payment selection
- `/payment` — validated simulated checkout
- `/order-complete` — in-memory mock receipt and cleared cart
- `/guide` — usage, delivery, payment, FAQ, privacy and demo terms
- `/contact` — validated, simulated contact submission
- Unknown paths and product slugs show a Japanese not-found state.

Catalog URL parameters are `q`, `category`, and `sort` (`recommended`, `new`, `price-asc`, `price-desc`). `/products/ryu-no-toki?view=3d` opens the 3D demo directly.

## Data and behavior

`src/data/products.ts` is the single source of truth for 12 products, categories, prices, stock, image references, and specifications. Prices are tax-inclusive sample values. Shipping is ¥800 below ¥30,000 and free at or above ¥30,000. Out-of-stock items cannot be added. Cart counts use total quantities, and quantities are bounded by stock.

`StoreContext` persists only product IDs/quantities and favorite IDs under `yakuza-cart` and `yakuza-favorites`. Persisted data is validated and clamped to current stock. Corrupt data is ignored; unavailable browser storage shows a Japanese warning and falls back to in-memory state.

Customer information and the mock order exist only in React memory. Reloading checkout requires reentering customer details, while the cart remains saved. Reloading the completion page removes the temporary receipt. Completing an order clears the saved cart but retains favorites.

## Limitations and deliberate demo behavior

- Payments, orders, account access, and contact submissions are clearly labeled simulations. There are no network submissions, emails, charges, or shipments.
- Credit-card controls are read-only fixed sample values. Real card credentials cannot be entered and are never persisted.
- The katana has an actual interactive procedural Three.js model with drag, touch, scroll, keyboard rotation/zoom, and reset controls. It is a simplified shape demonstration, not an exact product model. No external GLB/GLTF asset is supplied; `model3DUrl` remains unset. Other items offer an honest image-gallery fallback, as does the viewer on unsupported WebGL devices.
- Product photos are original generated imagery in one contact sheet. Each product selects its own region; thumbnail views zoom the same photo and are labeled accordingly. They are not alternate photographed angles. The generated hero is artwork only; all page text and controls are native HTML/React.
- Fonts are self-hosted from Fontsource. The page does not rely on remote image or font hosts. Generated art and prompt provenance are recorded in `docs/ASSETS.md`.

## Verification

Playwright covers the full shopping journey, persistence, stock/quantity limits, shipping, search/filter/sort/pagination, all payment methods, incomplete checkout, contact validation, mobile navigation, browser history, unknown routes, 3D interaction, and fallback handling. Test screenshots and traces are written into ignored `test-results/`.

Verified on 2026-10-28: TypeScript, ESLint, and the production build pass; **15/15 Playwright browser tests pass**. Responsive checks include 320px, 390px, 768px, 1024px, and 1440px viewports. The build emits one advisory for the lazy-loaded Three.js viewer chunk (about 528 kB minified / 135 kB gzip); it does not affect the initial app bundle and is fetched only when opening the 3D viewer.

The project uses native CSS for the custom storefront rather than adding a utility framework. Three.js is lazy-loaded only when the user opens its viewer.
