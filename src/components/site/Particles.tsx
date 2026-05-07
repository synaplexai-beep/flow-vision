import { useMemo } from "react";

export function Embers({ count = 28 }: { count?: number }) {
  const items = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 5,
      hue: Math.random() > 0.5 ? "oklch(0.85 0.15 70)" : "oklch(0.7 0.18 45)",
    })), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size,
            background: p.hue,
            filter: "blur(0.5px)",
            boxShadow: `0 0 ${p.size * 4}px ${p.hue}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
