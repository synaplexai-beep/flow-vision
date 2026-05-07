import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { products, type Mood } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { motion } from "framer-motion";

const moods: ("All" | Mood)[] = ["All", "Calm", "Warm", "Fresh", "Bold"];

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "The Collection — Ember & Oak" },
      { name: "description", content: "Browse the Ember & Oak collection of handcrafted scented candles. Filter by mood and find your scent." },
    ],
  }),
  component: Collection,
});

function Collection() {
  const [filter, setFilter] = useState<"All" | Mood>("All");
  const list = filter === "All" ? products : products.filter((p) => p.mood === filter);
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The Collection</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Find your <span className="text-gradient-gold">scent</span>.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Six signature candles, hand-poured in small batches. Filter by mood to begin.</p>
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        {moods.map((m) => (
          <motion.button
            key={m} onClick={() => setFilter(m)} whileTap={{ scale: 0.96 }}
            className={`relative rounded-full px-5 py-2 text-sm transition-colors ${filter === m ? "text-coal" : "text-foreground/80 glass hover:text-foreground"}`}
          >
            {filter === m && (
              <motion.span layoutId="moodPill" className="absolute inset-0 rounded-full bg-gradient-to-r from-[oklch(0.86_0.12_80)] to-[oklch(0.7_0.16_55)] shadow-glow" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
            <span className="relative">{m}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </div>
  );
}
