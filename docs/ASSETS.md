# Asset provenance

## Reference-led revision

The active storefront now uses `public/images/store-hero.png`, `public/images/temple-banner.png`, and `public/images/sakura-corners.png`. All three were generated with the built-in ImageGen tool. The original `hero.png` below is retained, but is no longer used by the app. Reference screenshots remain visual references only.

Final hero prompt:

> Create only a cinematic photographic background asset, no text or user interface. Ultra-wide 3:1 composition for Japanese decor shop hero inspired by Japanese ink wash and premium product photography. Left 43 percent is almost white warm ivory rice-paper mist, with faint grayscale Japanese temple silhouettes and delicate pink cherry blossom branches entering upper left corner. Smooth readable pale negative space in left center for black headline overlay. Right 57 percent: stunning black and crimson samurai armor with a horned helmet behind an ornate black and gold katana displayed horizontally on black stand on a wooden table, traditional dark Japanese interior, shoji window, a large muted red sun seen through window, pink cherry blossoms at top and bottom right. Crisp detailed premium black/red/gold product photography on right, restrained grayscale mist on left, very little orange color. Seamless transition pale left into dark right. No text, logos, words, letters, watermarks, borders, panels or web page screenshot.

Final sakura overlay prompt:

> Create a refined Japanese cherry blossom corner border ornament as a single transparent PNG asset for an ivory paper ecommerce website. Landscape 3:2 canvas. Only thin, elegant, realistic sumi-e dark brown cherry tree branches with many small pale pink sakura blossoms around all FOUR OUTER CORNERS. Branches must stay strictly within the outer 12 percent of the image. Upper left and lower right fuller, upper right and lower left lighter. Large center fully empty transparent; outer edge seamlessly clipped by image edges. Delicate desaturated pink petals, charcoal ink branches, premium traditional Japanese style, photorealistic ink-on-washi illustration. No background at all: genuinely transparent background between branches and across the whole center. No text, logos, sun, buildings, frame lines or UI. A decorative transparent edge layer, not a website screenshot.

Final temple banner prompt:

> Create a cinematic ultra-wide 3:1 Japanese architectural photographic banner background, no text or UI. Premium Japanese decor visual identity. Layered traditional Kyoto temple roofs and beautiful black wooden Japanese pagoda architecture across the landscape. A large muted crimson red sun behind a roof on the right, light gray misty mountains at center, delicate pink cherry blossoms and dark flowering branches framing the upper right and lower left. Mostly charcoal, silver-gray ink, ivory mist and deep crimson; avoid warm orange. Left 35 percent is very dark black charcoal forest and shadowed temple roof with low detail, suitable for white heading overlay; main architectural detail and red sun in right half. Atmospheric Japanese ink-wash mixed with photographic realism, subtle rice-paper grain. No words, letters, typography, logos, watermark, UI, buttons or website screenshot.

The revised wordmark uses the self-hosted Permanent Marker typeface from Fontsource (SIL Open Font License).

Original artwork was generated with the built-in ImageGen tool for this project. The existing four PNGs in `design-references/` informed the art direction and were not used as page screenshots or application backgrounds.

## Hero

Saved at `public/images/hero.png`.

Final prompt:

> Use case: ads-marketing. Create a cinematic ultra-wide website hero photograph for YAKUZA DECOR Japanese interior collectibles store. 3:1 landscape composition. A traditional dark wooden Japanese room with a katana displayed horizontally on a beautiful black and gold stand on the right foreground, a black and crimson samurai armor helmet in the right background, an open shoji window behind it revealing a Japanese temple roof and mountain mist, huge muted crimson setting sun. Cherry blossom branches elegantly frame the upper corners. Left half is soft warm pale ivory mist, low detail negative space suitable for dark Japanese headline overlay. Right half rich charcoal, antique gold, deep red, pink blossoms. Beautiful soft painterly photographic texture, refined premium artisan campaign. No text, no lettering, no website UI, no typography, no watermark. Generate an original photograph, not a screenshot.

## Product contact sheet

Saved at `public/images/products.png`. Product images select individual cells of this original photographic contact sheet with CSS background positioning. Cell coordinates are centralized in `ProductImage.tsx`; the product-to-cell mapping is in `products.ts`.

Final prompt:

> Use case: product-mockup. Asset type: one coherent photographic 12-panel catalogue contact sheet, intended as a CSS image sprite on a Japanese decor shop. Precisely 4 columns x 3 rows in a square 1536x1536 contact sheet. Each cell same size; no gaps no borders no text. Each cell contains one centered product fully visible with generous margins, same charcoal Japanese studio background, polished warm wood base, atmospheric soft golden side lighting. Row 1 left to right: a single black and gold ornamental katana on low stand; a red horned Japanese Hannya Oni mask on stand; a detailed black red armored samurai figurine; a glowing Japanese square wooden paper lantern. Row 2 left to right: two black and gold decorative katana swords together on stand; a white horned Oni mask with gold horns on stand; a coiled golden Japanese dragon sculpture; an elegant dark blue ceramic vase with cherry blossom decoration. Row 3 left to right: a framed delicate cherry blossom wall ornament; a black and gold maneki neko lucky cat; a standing black and gold Japanese armor miniature; a bronze Japanese incense burner. Photorealistic high-end ecommerce studio photos, dark uniform backgrounds, highly detailed objects, premium Japanese interior decor visual identity. No text, captions, numbers, labels, watermark or UI. Keep each object inside its own precisely aligned rectangular cell.

## Other assets

The 3D katana is an original procedural Three.js model defined in `Product3DViewer.tsx`; no external model license or download is needed. It is explicitly identified as a simplified demo in the customer UI. The favicon is a simple crimson circular seal with the kanji 極. Noto Sans JP and Noto Serif JP are bundled through Fontsource under the SIL Open Font License; their license files remain in the installed packages.
