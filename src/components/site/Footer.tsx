import { Link } from "@tanstack/react-router";
import { Flame, Instagram, Twitter, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 px-6 pt-20 pb-10 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.82_0.13_75)] to-[oklch(0.55_0.13_45)] text-coal">
              <Flame className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Ember & Oak</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Handcrafted scented candles, poured in small batches. Made for slow rooms and warm evenings.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground/90">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/collection" className="hover:text-foreground">All Candles</Link></li>
            <li><Link to="/collection" className="hover:text-foreground">New Arrivals</Link></li>
            <li><Link to="/collection" className="hover:text-foreground">Gifting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground/90">Brand</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><a href="#" className="hover:text-foreground">Sustainability</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground/90">Stay close</h4>
          <p className="mt-4 text-sm text-muted-foreground">Slow letters, seasonal scents, no noise.</p>
          <form className="mt-4 flex items-center gap-2 rounded-full glass p-1.5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email" required placeholder="you@home.com"
              className="flex-1 bg-transparent px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
              <Send className="h-3 w-3" /> Subscribe
            </button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl items-center justify-between border-t border-white/5 pt-6 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Ember & Oak. Poured by hand.</p>
        <p className="text-shine font-display tracking-wide">Light the moment.</p>
      </div>
    </footer>
  );
}
