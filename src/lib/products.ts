export type Mood = "Calm" | "Warm" | "Fresh" | "Bold";

export type Product = {
  slug: string;
  name: string;
  collection: string;
  price: number;
  mood: Mood;
  notes: { top: string[]; heart: string[]; base: string[] };
  burnHours: number;
  weightG: number;
  description: string;
  image: string;
  waxColor: string; // oklch string for the 3D candle wax
  flameColor: string;
};

export const products: Product[] = [
  {
    slug: "vanilla-noir",
    name: "Vanilla Noir",
    collection: "Vanilla Collection",
    price: 48,
    mood: "Warm",
    notes: { top: ["Bourbon Vanilla"], heart: ["Tonka Bean", "Cocoa"], base: ["Sandalwood", "Amber"] },
    burnHours: 55,
    weightG: 240,
    description:
      "A velvet-dark take on classic vanilla — bourbon richness folded into tonka and warm sandalwood. The kind of glow you want at dusk.",
    image:
      "https://images.unsplash.com/photo-1602178141046-0c3724cdcdb2?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.32 0.04 60)",
    flameColor: "#ffb46b",
  },
  {
    slug: "lavender-calm",
    name: "Lavender Calm",
    collection: "Lavender Calm",
    price: 42,
    mood: "Calm",
    notes: { top: ["French Lavender"], heart: ["Chamomile", "Linen"], base: ["White Musk"] },
    burnHours: 50,
    weightG: 220,
    description:
      "Quiet fields at dawn. French lavender drifts over chamomile and clean linen — designed for slow Sundays and deep sleep.",
    image:
      "https://images.unsplash.com/photo-1601930470495-aa75d3a4f1ee?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.82 0.04 290)",
    flameColor: "#cdb6ff",
  },
  {
    slug: "oud-royale",
    name: "Oud Royale",
    collection: "Oud Luxury",
    price: 68,
    mood: "Bold",
    notes: { top: ["Saffron"], heart: ["Oud", "Rose"], base: ["Leather", "Amber"] },
    burnHours: 60,
    weightG: 260,
    description:
      "An heirloom in wax. Saffron and rose meet smoky oud and supple leather — a fragrance built for marble, velvet and late conversations.",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.22 0.04 40)",
    flameColor: "#ff8a3d",
  },
  {
    slug: "rose-elysee",
    name: "Rose Élysée",
    collection: "Rose Essence",
    price: 52,
    mood: "Warm",
    notes: { top: ["Pink Pepper"], heart: ["Damask Rose", "Peony"], base: ["Patchouli"] },
    burnHours: 55,
    weightG: 240,
    description:
      "A Parisian florist at golden hour — damask rose softened by peony, lifted by a whisper of pink pepper.",
    image:
      "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.78 0.08 20)",
    flameColor: "#ff9aa2",
  },
  {
    slug: "ocean-drift",
    name: "Ocean Drift",
    collection: "Ocean Breeze",
    price: 44,
    mood: "Fresh",
    notes: { top: ["Sea Salt", "Bergamot"], heart: ["Driftwood"], base: ["Vetiver"] },
    burnHours: 52,
    weightG: 220,
    description:
      "Linen curtains, salt on the tongue, light through old wood. A coastal exhale.",
    image:
      "https://images.unsplash.com/photo-1602874801006-94f1e76e87f3?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.86 0.03 220)",
    flameColor: "#9ed8ff",
  },
  {
    slug: "cafe-maison",
    name: "Café Maison",
    collection: "Coffee Aroma",
    price: 46,
    mood: "Warm",
    notes: { top: ["Espresso"], heart: ["Cocoa", "Hazelnut"], base: ["Vanilla", "Cedar"] },
    burnHours: 54,
    weightG: 230,
    description:
      "A morning ritual in a glass — fresh espresso, melted cocoa and a thread of warm cedar.",
    image:
      "https://images.unsplash.com/photo-1599054735388-bcb07bdd3574?auto=format&fit=crop&w=1200&q=80",
    waxColor: "oklch(0.28 0.05 50)",
    flameColor: "#ffae66",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
