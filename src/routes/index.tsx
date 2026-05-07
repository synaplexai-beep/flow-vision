import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Leaf, Moon, Sparkles, Heart, Home as HomeIcon, Wind } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SplitWords } from "@/components/site/Reveal";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Embers } from "@/components/site/Particles";

const HeroCandle = lazy(() => import("@/components/site/HeroCandle").then(m => ({ default: m.HeroCandle })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember & Oak — Light the moment" },
      { name: "description", content: "Cinematic, handcrafted luxury scented candles for modern homes. Explore the Ember & Oak collection." },
    ],
  }),
  component: Home,
});

const benefits = [
  { icon: Leaf, title: "Stress Relief", body: "Soft notes of lavender and chamomile coax shoulders down and breath out." },
  { icon: Moon, title: "Better Sleep", body: "A nightly ritual that signals the room — and you — that it's time to rest." },
  { icon: Sparkles, title: "Luxury Atmosphere", body: "Glow, scent, hush — the three things every great room shares." },
  { icon: Heart, title: "Aromatherapy", body: "Essential oil blends, formulated to lift mood and warm a space." },
  { icon: Flame, title: "Mood Enhancement", body: "Warm light is the oldest interior design trick. We bottled it." },
  { icon: HomeIcon, title: "Décor Object", body: "Sculpted vessels designed to sit beautifully even when unlit." },
];

function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative grain mx-auto flex min-h-[88vh] max-w-7xl flex-col items-stretch gap-8 px-6 pb-24 md:flex-row md:px-12">
        <Embers count={36} />
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              New · Autumn Atelier
            </span>
          </Reveal>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
            <SplitWords text="Handcrafted warmth" />
            <br />
            <span className="text-gradient-gold"><SplitWords text="for modern homes." /></span>
          </h1>

          <Reveal delay={0.4}>
            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              Premium scented candles, poured by hand in small batches. Designed to slow rooms down and make evenings feel longer.
            </p>
          </Reveal>

          <Reveal delay={0.55} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/collection"><MagneticButton>Explore Collection <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
            <Link to="/about"><MagneticButton variant="ghost">Experience the Aroma</MagneticButton></Link>
          </Reveal>

          <Reveal delay={0.75} className="mt-12 flex items-center gap-8 text-xs text-muted-foreground">
            <div><div className="font-display text-2xl text-foreground">50h+</div>Burn time</div>
            <div className="h-8 w-px bg-white/10" />
            <div><div className="font-display text-2xl text-foreground">100%</div>Soy & coconut wax</div>
            <div className="h-8 w-px bg-white/10" />
            <div><div className="font-display text-2xl text-foreground">12</div>Signature scents</div>
          </Reveal>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-full max-w-[560px]">
            <div className="absolute inset-10 rounded-full bg-gradient-to-br from-[oklch(0.74_0.19_50)/0.4] to-transparent blur-3xl" />
            <Suspense fallback={
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-72 w-40 rounded-2xl bg-gradient-to-b from-[oklch(0.32_0.04_60)] to-[oklch(0.18_0.02_50)] shadow-glow animate-flicker" />
              </div>
            }>
              <HeroCandle waxColor="#3a2820" />
            </Suspense>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
              className="absolute -bottom-2 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/60 blur-2xl"
            />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Reveal>
        <div className="border-y border-white/5 py-6 overflow-hidden">
          <div className="flex animate-[shine_40s_linear_infinite] gap-12 whitespace-nowrap font-display text-2xl text-muted-foreground/60">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 items-center gap-12">
                {["Vanilla Noir", "Lavender Calm", "Oud Royale", "Rose Élysée", "Ocean Drift", "Café Maison"].map((t) => (
                  <span key={t} className="flex items-center gap-12">
                    {t} <Flame className="h-4 w-4 text-primary" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-12">
        <div className="flex items-end justify-between gap-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The Atelier</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Three to <span className="text-gradient-gold">begin</span> with.</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/collection" className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              See full collection <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative mx-auto max-w-7xl px-6 py-28 md:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_50%_0%,oklch(0.32_0.08_50/0.4),transparent)]" />
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">Why a candle</p>
          <h2 className="mt-3 text-center font-display text-4xl md:text-5xl">More than light. <span className="text-gradient-gold">A ritual.</span></h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="group relative h-full overflow-hidden rounded-3xl glass p-6 transition-shadow hover:shadow-glow">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.86_0.12_80)] to-[oklch(0.55_0.13_45)] text-coal shadow-glow">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SCENT JOURNEY */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">A scent for every mood</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Pick by <span className="text-gradient-gold">feeling</span>.</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Calm", icon: Moon, gradient: "from-[oklch(0.4_0.04_260)] to-[oklch(0.25_0.05_280)]" },
            { label: "Warm", icon: Flame, gradient: "from-[oklch(0.45_0.12_50)] to-[oklch(0.2_0.06_30)]" },
            { label: "Fresh", icon: Wind, gradient: "from-[oklch(0.45_0.06_220)] to-[oklch(0.22_0.04_200)]" },
            { label: "Bold", icon: Sparkles, gradient: "from-[oklch(0.4_0.1_30)] to-[oklch(0.18_0.04_20)]" },
          ].map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06}>
              <Link to="/collection" className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${m.gradient} p-6 aspect-[4/5]`}>
                <m.icon className="h-6 w-6 text-white/80" />
                <div className="absolute inset-x-6 bottom-6">
                  <p className="font-display text-3xl text-white">{m.label}</p>
                  <p className="mt-1 text-xs text-white/60">Discover</p>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <img src="https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1200&q=80" alt="Hands pouring wax in a workshop" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Our story</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Slow craft, <span className="text-gradient-gold">soft glow</span>.</h2>
            <p className="mt-6 text-muted-foreground">
              Ember & Oak began in a quiet workshop where two friends — a perfumer and a designer — set out to make candles that felt like furniture. Sculpted vessels, perfumer-grade oils, soy-coconut wax. Made to be lit, kept, and remembered.
            </p>
            <div className="mt-8">
              <Link to="/about"><MagneticButton variant="ghost">Read the story <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] glass-strong p-10 md:p-16">
          <Embers count={20} />
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-3xl md:text-4xl">Light the moment.</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Free shipping on orders over $80. Hand-wrapped, every time.</p>
            </div>
            <Link to="/collection"><MagneticButton>Shop Luxury Candles <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
