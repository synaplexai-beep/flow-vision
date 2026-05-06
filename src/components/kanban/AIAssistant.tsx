import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string; }

export function AIAssistant({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm Flow. Ask me anything about your board, or tell me to create, move, or update tasks." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("kanban-ai", {
        body: { messages: next, board_id: boardId },
      });
      if (error) throw error;
      if (data.error) { toast.error(data.error); setMessages(m => [...m, { role: "assistant", content: `⚠️ ${data.error}` }]); }
      else {
        setMessages(m => [...m, { role: "assistant", content: data.reply || "Done." }]);
        if (data.actions?.length) qc.invalidateQueries({ queryKey: ["board", boardId] });
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:scale-105"
      >
        <Sparkles className="h-4 w-4" /> AI Assistant
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between border-b p-4">
            <SheetTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Flow Assistant</SheetTitle>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}>
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-muted-foreground">Thinking…</div>}
          </div>

          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask or instruct…" disabled={busy} />
              <Button size="icon" onClick={send} disabled={busy}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
