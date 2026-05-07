import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl glass shadow-soft"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(400px 200px at 50% 100%, ${product.flameColor}33, transparent 70%)` }}
          />
          <div className="absolute left-4 top-4">
            <span className="rounded-full glass-strong px-3 py-1 text-[11px] uppercase tracking-wider text-foreground/90">
              {product.mood}
            </span>
          </div>
          <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full glass-strong opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end justify-between p-5">
          <div>
            <h3 className="font-display text-xl leading-tight">{product.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{product.collection}</p>
          </div>
          <p className="font-display text-lg text-gradient-gold">${product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}
