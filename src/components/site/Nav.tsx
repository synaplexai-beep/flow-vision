import { Link } from "@tanstack/react-router";
import { ShoppingBag, Flame, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const cart = useCart();
  const { theme, toggle } = useTheme();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.82_0.13_75)] to-[oklch(0.55_0.13_45)] text-coal shadow-glow">
            <Flame className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight">
            Ember <span className="text-muted-foreground">&</span> Oak
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full glass px-2 py-1.5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground hover:bg-white/5"
              activeProps={{ className: "rounded-full px-4 py-1.5 text-sm bg-white/10 text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => cart.setOpen(true)}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-full glass px-4 text-sm",
              "hover:ring-gold transition-shadow",
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground"
                >
                  {cart.count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
            onClick={() => setMobile((v) => !v)}
            aria-label="Menu"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden mx-4 mt-3 rounded-2xl glass-strong p-3"
          >
            {links.map((l) => (
              <Link
                key={l.to} to={l.to}
                onClick={() => setMobile(false)}
                className="block rounded-xl px-4 py-3 text-sm hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
