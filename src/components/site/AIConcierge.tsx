import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sparkles, Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me pick a scent for my bedroom",
  "What pairs with a quiet rainy evening?",
  "Best gift for a coffee lover?",
];

export function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Welcome to **Ember & Oak**. I'm your scent concierge — tell me about a mood, a room, or a memory, and I'll find a candle for it." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  const send = async (text: string) => {
    const v = text.trim(); if (!v || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: v }];
    setMessages(next); setBusy(true);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/candle-ai`;
    let assistant = "";
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 429) throw new Error("I'm catching my breath — try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add funds in Lovable Cloud.");
      if (!res.ok || !res.body) throw new Error("Concierge unavailable.");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = ""; let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buffer += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl); buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistant += c;
              setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: assistant } : msg));
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch (e) {
      setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: `⚠️ ${(e as Error).message}` } : msg));
    } finally { setBusy(false); }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: "spring" }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.86_0.12_80)] to-[oklch(0.7_0.16_55)] px-5 py-3 text-sm font-medium text-coal shadow-glow transition-transform hover:scale-105"
        aria-label="Open AI concierge"
      >
        <Sparkles className="h-4 w-4" /> Scent Concierge
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-white/10 bg-background p-0 sm:max-w-md">
          <SheetHeader className="border-b border-white/5 p-5">
            <SheetTitle className="flex items-center gap-2 font-display text-xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.82_0.13_75)] to-[oklch(0.55_0.13_45)] text-coal">
                <Bot className="h-4 w-4" />
              </span>
              Concierge
            </SheetTitle>
            <p className="text-xs text-muted-foreground">Personal scent guidance, on the house.</p>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "glass text-foreground",
                )}>
                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-strong:text-foreground">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full glass px-3 py-1.5 text-xs hover:ring-gold">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-2 rounded-full glass p-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about a scent…"
                disabled={busy}
                className="flex-1 bg-transparent px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => send(input)} disabled={busy}
                className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
