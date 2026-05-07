import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const cart = useCart();
  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-white/10 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-white/5 p-5">
          <SheetTitle className="font-display text-xl">Your Atelier</SheetTitle>
          <p className="text-xs text-muted-foreground">Hand-poured. Reserved with care.</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.detailed.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full glass">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Your cart is quiet.</p>
                <Link
                  to="/collection" onClick={() => cart.setOpen(false)}
                  className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                >
                  Explore the Collection
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.detailed.map(({ product, qty }) => (
                <li key={product.slug} className="flex gap-3 rounded-2xl glass p-3">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base leading-tight">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.collection}</p>
                      </div>
                      <p className="text-sm font-medium">${(product.price * qty).toFixed(0)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full glass">
                        <button onClick={() => cart.update(product.slug, qty - 1)} className="grid h-7 w-7 place-items-center"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-xs">{qty}</span>
                        <button onClick={() => cart.update(product.slug, qty + 1)} className="grid h-7 w-7 place-items-center"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => cart.remove(product.slug)} className="text-muted-foreground hover:text-foreground"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/5 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-lg">${cart.subtotal.toFixed(0)}</span>
          </div>
          <button
            disabled
            className="mt-4 w-full rounded-full bg-gradient-to-r from-[oklch(0.86_0.12_80)] to-[oklch(0.7_0.16_55)] py-3 text-sm font-medium text-coal opacity-70"
          >
            Checkout — coming soon
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Secure payments arriving shortly.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
