import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Layout, Bot, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
          <span className="text-lg font-semibold tracking-tight">Flow</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/signup"><Button>Get started</Button></Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-16 pb-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft">
          <Sparkles className="h-3 w-3" /> AI-powered project board
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
          The Kanban board that <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">organizes itself</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Build boards, drag tasks across columns, and let an AI assistant create, update, and move work for you — with a single message.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/signup"><Button size="lg" className="gap-2">Start free <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">I have an account</Button></Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: Layout, title: "Custom boards", desc: "Add columns, drag tasks, set priorities." },
            { icon: Bot, title: "AI assistant", desc: "Ask questions or have it move tasks for you." },
            { icon: Lock, title: "Private & saved", desc: "Your boards are yours, securely persisted." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-5 text-left shadow-soft">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent"><f.icon className="h-4 w-4" /></div>
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
