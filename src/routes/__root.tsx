import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/lib/theme";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AIConcierge } from "@/components/site/AIConcierge";
import { CartDrawer } from "@/components/site/CartDrawer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl text-gradient-gold">404</h1>
        <p className="mt-3 text-muted-foreground">This room is dark — nothing's lit here.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Return home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ember & Oak — Handcrafted Luxury Scented Candles" },
      { name: "description", content: "Hand-poured scented candles for modern homes. Discover the Ember & Oak collection — vanilla, oud, lavender, rose and more." },
      { property: "og:title", content: "Ember & Oak — Handcrafted Luxury Scented Candles" },
      { property: "og:description", content: "Light the moment. Hand-poured scented candles for modern homes." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <CartProvider>
          <SmoothScroll />
          <Nav />
          <main className="pt-24">
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <AIConcierge />
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
