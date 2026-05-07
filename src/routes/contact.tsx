import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Twitter, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ember & Oak" },
      { name: "description", content: "Reach the Ember & Oak studio. We answer every note, slowly and warmly." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setBusy(false);
    if (error) toast.error("Couldn't send — try again in a moment.");
    else { toast.success("Note received. We'll write back soon."); setForm({ name: "", email: "", message: "" }); }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Write to <span className="text-gradient-gold">the studio</span>.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">For custom orders, gifting, press, or just a hello — we read everything.</p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "hello@emberandoak.studio", href: "mailto:hello@emberandoak.studio" },
              { icon: Phone, label: "+1 (415) 555 — 0142", href: "tel:+14155550142" },
              { icon: MessageCircle, label: "WhatsApp the studio", href: "https://wa.me/14155550142" },
              { icon: MapPin, label: "27 Atelier Lane, San Francisco", href: "https://maps.google.com" },
            ].map((c) => (
              <a key={c.label} href={c.href} className="flex items-center gap-4 rounded-2xl glass p-4 transition-shadow hover:ring-gold">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.86_0.12_80)] to-[oklch(0.55_0.13_45)] text-coal">
                  <c.icon className="h-4 w-4" />
                </span>
                <span className="text-sm">{c.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full glass hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full glass hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl glass">
            <iframe
              title="Studio location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.43%2C37.76%2C-122.39%2C37.79&layer=mapnik"
              className="h-64 w-full opacity-90"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="space-y-4 rounded-3xl glass-strong p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-muted-foreground">Your name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-muted-foreground">Your note</span>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </label>
            <div className="flex items-center justify-end pt-2">
              <MagneticButton type="submit" disabled={busy}>
                {busy ? "Sending…" : <>Send Note <Send className="h-4 w-4" /></>}
              </MagneticButton>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
