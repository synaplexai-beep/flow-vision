import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { getProduct, products } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";
import { MagneticButton } from "@/components/site/MagneticButton";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Flame, Clock, Droplets, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Embers } from "@/components/site/Particles";

const HeroCandle = lazy(() => import("@/components/site/HeroCandle").then(m => ({ default: m.HeroCandle })));

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    return {
      meta: [
        { title: p ? `${p.name} — Ember & Oak` : "Candle — Ember & Oak" },
        { name: "description", content: p?.description ?? "Handcrafted scented candles." },
        ...(p ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h1 className="font-display text-4xl">Candle not found</h1>
        <Link to="/collection" className="mt-4 inline-flex text-primary">Back to collection</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
  component: ProductDetail,
});

function ProductDetail() {
  const product = Route.useLoaderData();
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      <Link to="/collection" className="text-xs text-muted-foreground hover:text-foreground">← Collection</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] glass">
          <Embers count={18} />
          <div className="absolute inset-0">
            <Suspense fallback={
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            }>
              <HeroCandle waxColor={product.waxColor} />
            </Suspense>
          </div>
        </div>

        <div>
          <Reveal>
            <span className="rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/80">{product.collection}</span>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">{product.name}</h1>
            <p className="mt-2 font-display text-2xl text-gradient-gold">${product.price}</p>
            <p className="mt-6 text-muted-foreground">{product.description}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl glass p-4">
                <Flame className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Mood</p>
                <p className="font-display text-base">{product.mood}</p>
              </div>
              <div className="rounded-2xl glass p-4">
                <Clock className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Burn</p>
                <p className="font-display text-base">{product.burnHours}h</p>
              </div>
              <div className="rounded-2xl glass p-4">
                <Droplets className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Weight</p>
                <p className="font-display text-base">{product.weightG}g</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 rounded-2xl glass p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scent pyramid</p>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Top </span>· {product.notes.top.join(", ")}</div>
                <div><span className="text-muted-foreground">Heart </span>· {product.notes.heart.join(", ")}</div>
                <div><span className="text-muted-foreground">Base </span>· {product.notes.base.join(", ")}</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full glass">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-display">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
              </div>
              <MagneticButton onClick={() => cart.add(product.slug, qty)}>Add to Cart · ${product.price * qty}</MagneticButton>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Free shipping over $80 · Hand-wrapped</p>
          </Reveal>
        </div>
      </div>

      <section className="mt-32">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">You might also <span className="text-gradient-gold">love</span></h2>
          <Link to="/collection" className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">All candles <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
