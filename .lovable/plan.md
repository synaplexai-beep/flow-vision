
# Ember & Oak — Luxury Scented Candle Site

Pivoting the project: the Kanban app is removed and replaced with a cinematic, multi-route luxury candle brand site under the name **Ember & Oak** — *"Handcrafted warmth for modern homes."*

## Brand & design system

- Palette: matte black `#0E0B08`, deep beige `#C9B79C`, warm ivory `#F5EFE6`, candlelight orange `#FF8A3D`, soft gold `#D4A24C`, cream gradients.
- Type: serif display (Fraunces) for headlines, clean sans (Inter) for body — loaded via Google Fonts in `__root.tsx`.
- Motion language: slow easings, subtle parallax, magnetic hovers, scroll reveals, ambient flame flicker.
- Rebuild `src/styles.css` tokens (light + dark, dark is the primary cinematic theme), add utility classes for glass, glow, grain, magnetic.

## Tech additions

- `bun add three @react-three/fiber @react-three/drei framer-motion lenis` (R3F for hero candle, Framer Motion everywhere, Lenis for inertia scroll).
- Keep existing shadcn/ui, react-query, Supabase client, Lovable AI gateway.

## Route map (TanStack Start)

```
src/routes/
  __root.tsx          shell, fonts, Lenis smooth-scroll, Nav, Footer, AI dock, Cart drawer
  index.tsx           Hero + featured + benefits teaser + CTA
  collection.tsx      Full product grid + filters
  product.$slug.tsx   Product detail w/ 3D candle + add-to-cart
  about.tsx           Brand story
  contact.tsx         Form, map, socials, WhatsApp
```

Each route gets unique `head()` meta (title/description/og). Old Kanban routes (`board`, `login`, `signup`) and all `src/components/kanban/*`, `src/lib/kanban-*`, `supabase/functions/kanban-ai`, `src/lib/auth.tsx` are deleted.

## Hybrid 3D hero

- `HeroCandle.tsx` — R3F `<Canvas>` with:
  - Procedural pillar candle (CylinderGeometry + subtle noise normalMap), wax color responds to ambient point light.
  - Animated flame: a soft additive sprite + emissive cone, flicker via `useFrame` sin/noise, gently follows cursor.
  - Warm point light + bloom (`@react-three/drei` `EffectComposer` if light enough; otherwise CSS glow).
  - Cursor parallax on the camera; OrbitControls disabled.
- Background: animated gradient + floating ember particles (Framer Motion divs, GPU-cheap) + faint grain overlay.
- Headline: "Handcrafted warmth for modern homes." with staggered letter reveal.
- CTAs: magnetic "Explore Collection" + ghost "Experience the Aroma".

## Sections (index)

1. Cinematic hero (above).
2. Featured trio of candles — tilt cards w/ glow, image zoom on hover.
3. Benefits — 6 animated cards (Stress Relief, Better Sleep, Luxury Atmosphere, Aromatherapy, Mood, Décor) with lucide icons, scroll-triggered fade/translate.
4. Scent journey strip — horizontal scroll of categories.
5. About teaser → links `/about`.
6. Newsletter / CTA band.

## Collection & product

- `lib/products.ts` — local catalog of 6 candles (Vanilla Noir, Lavender Calm, Oud Royale, Rose Élysée, Ocean Drift, Café Maison) with slug, price, notes, burn time, image (use Unsplash/Pexels URLs).
- Collection page: filter chips by mood (Calm / Warm / Fresh / Bold), grid of glassmorphism cards, quick-view dialog.
- Product detail: split layout — left R3F mini candle in matching wax color; right name, notes, price, qty, "Add to cart", scent pyramid, related products.

## Cart (local, checkout later)

- `lib/cart.tsx` — Zustand-free context + `localStorage` persistence (`items`, `add/remove/update/clear`).
- Slide-in `Sheet` cart drawer triggered from nav badge; subtotal + disabled "Checkout (coming soon)" button. Plan note: Stripe wiring left as a follow-up step using Lovable's built-in payments.

## AI Concierge

- New edge function `supabase/functions/candle-ai` (replaces `kanban-ai`), `verify_jwt = false`, calls Lovable AI gateway with `google/gemini-3-flash-preview` (streaming). System prompt: Ember & Oak concierge — recommends scents by mood/room, answers FAQ, can reference the catalog (passed in messages context).
- `components/site/AIConcierge.tsx` — floating gold button bottom-right, opens luxe `Sheet` chat with markdown rendering, suggested prompts ("Help me pick a scent for my bedroom"), streamed tokens. Reuses streaming pattern from docs.

## Contact

- Elegant form (name, email, message) — submits to a new `contact_messages` table via supabase insert (no auth required, RLS allows anon insert only).
- Socials, email, phone, WhatsApp deep link, embedded static map iframe.
- Migration: create `contact_messages` table + RLS (insert: anon true; select: none).

## Database changes

- New migration:
  - Drop kanban tables: `task_comments`, `tasks`, `board_columns`, `boards` (cascade). Keep `profiles` (harmless).
  - Create `contact_messages(id, name, email, message, created_at)` with RLS allowing public insert only.

## Global UX

- Lenis smooth scroll mounted in `__root.tsx`.
- Custom cursor blob (mix-blend-difference) that scales on interactive elements.
- Page transitions via Framer Motion `AnimatePresence` keyed on route pathname.
- Loading screen: first-mount overlay with logo + flame, fades after fonts/3D ready.
- Responsive: 3D hero downgrades to a high-quality static composition + particles below `md`.

## Deletions

- `src/routes/board.tsx`, `login.tsx`, `signup.tsx`
- `src/components/kanban/*`
- `src/lib/kanban-api.ts`, `kanban-types.ts`, `auth.tsx`
- `supabase/functions/kanban-ai/`

## Out of scope (next step)

- Real Stripe checkout (will offer Lovable's built-in Stripe payments after this lands).
- User accounts / order history.
- CMS for products.
