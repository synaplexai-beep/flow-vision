import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "./products";

export type CartItem = { slug: string; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  update: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  detailed: { product: Product; qty: number }[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ember-oak-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === slug);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((slug: string, qty: number) => {
    setItems((prev) => prev.map((x) => (x.slug === slug ? { ...x, qty: Math.max(1, qty) } : x)));
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const detailed = useMemo(
    () =>
      items
        .map((it) => {
          const product = products.find((p) => p.slug === it.slug);
          return product ? { product, qty: it.qty } : null;
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [items],
  );

  const subtotal = detailed.reduce((s, x) => s + x.product.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, subtotal, add, update, remove, clear, open, setOpen, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
