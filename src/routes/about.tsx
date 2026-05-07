import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { MagneticButton } from "@/components/site/MagneticButton";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Ember & Oak" },
      { name: "description", content: "How Ember & Oak came to be — a perfumer, a designer, and a love of slow rooms." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Our story</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-7xl">A workshop, <br /><span className="text-gradient-gold">two friends</span>, one flame.</h1>
      </Reveal>

      <Reveal delay={0.15}>
        <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1600&q=80" alt="Candle workshop" className="mt-12 aspect-[16/9] w-full rounded-[2rem] object-cover shadow-lift" />
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl">Hand-poured, one batch at a time.</h2>
          <p className="mt-4 text-muted-foreground">
            Every Ember & Oak candle starts on a marble bench in a quiet studio. We blend a soy-coconut wax base for a slow, even burn, then layer perfumer-grade oils sourced from family ateliers in Grasse, Cairo and Mumbai.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl">Designed to outlast their light.</h2>
          <p className="mt-4 text-muted-foreground">
            Each vessel is sculpted to live on long after the wax. Heavy glass, matte ceramic, hand-finished oak lids — built to be refilled, kept, passed down. Beautiful in shadow, alive in glow.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <blockquote className="mt-20 rounded-3xl glass p-10 text-center font-display text-2xl md:text-3xl">
          "We don't make candles to fill rooms. <br className="hidden md:block" />We make them to <span className="text-gradient-gold">slow them down</span>."
          <footer className="mt-6 text-sm text-muted-foreground font-sans">— Maya & Theo, founders</footer>
        </blockquote>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-3xl glass-strong p-8">
          <div>
            <h3 className="font-display text-2xl">Begin your collection.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Six signature scents, hand-wrapped.</p>
          </div>
          <Link to="/collection"><MagneticButton>Browse Candles <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
        </div>
      </Reveal>
    </div>
  );
}
