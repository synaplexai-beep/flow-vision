import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
};

export function MagneticButton({
  children, className, variant = "primary", strength = 18, ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    x.set(px * strength); y.set(py * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-shadow",
        variant === "primary"
          ? "bg-gradient-to-r from-[oklch(0.86_0.12_80)] to-[oklch(0.7_0.16_55)] text-coal shadow-glow hover:shadow-lift"
          : "glass text-foreground hover:ring-gold",
        className,
      )}
      {...(rest as any)}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
      )}
    </motion.button>
  );
}
