import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { Sparkles, Plus, LogOut, Layout, Settings as SettingsIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { ensureFirstBoard, getBoardData, createColumn, renameColumn, deleteColumn, createTask, moveTask, renameBoard } from "@/lib/kanban-api";
import { supabase } from "@/integrations/supabase/client";
import { ColumnView } from "@/components/kanban/ColumnView";
import { TaskCard } from "@/components/kanban/TaskCard";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { AIAssistant } from "@/components/kanban/AIAssistant";
import type { Task } from "@/lib/kanban-types";
import { toast } from "sonner";

export const Route = createFileRoute("/board")({ component: BoardPage });

function BoardPage() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [editingBoard, setEditingBoard] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  useEffect(() => {
    if (user) ensureFirstBoard(user.id).then(b => setBoardId(b.id)).catch(e => toast.error(e.message));
  }, [user]);

  const { data } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardData(boardId!),
    enabled: !!boardId,
  });

  const { data: commentCounts = {} } = useQuery({
    queryKey: ["comment-counts", boardId],
    queryFn: async () => {
      const { data: rows } = await supabase.from("task_comments").select("task_id").in("task_id", (data?.tasks ?? []).map(t => t.id));
      const counts: Record<string, number> = {};
      (rows ?? []).forEach(r => { counts[r.task_id] = (counts[r.task_id] || 0) + 1; });
      return counts;
    },
    enabled: !!data?.tasks?.length,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasksByCol = useMemo(() => {
    const map: Record<string, Task[]> = {};
    (data?.columns ?? []).forEach(c => map[c.id] = []);
    (data?.tasks ?? []).forEach(t => { (map[t.column_id] ||= []).push(t); });
    Object.values(map).forEach(arr => arr.sort((a, b) => a.position - b.position));
    return map;
  }, [data]);

  const moveMut = useMutation({
    mutationFn: async ({ id, columnId, position }: { id: string; columnId: string; position: number }) => moveTask(id, columnId, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board", boardId] }),
  });

  const onDragStart = (e: DragStartEvent) => setActiveTask((e.active.data.current?.task as Task) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    const task = e.active.data.current?.task as Task | undefined;
    const overColId = e.over?.data.current?.columnId as string | undefined;
    if (!task || !overColId || task.column_id === overColId) return;
    const pos = (tasksByCol[overColId]?.length ?? 0);
    moveMut.mutate({ id: task.id, columnId: overColId, position: pos });
  };

  const handleAddTask = async (columnId: string) => {
    if (!user || !boardId) return;
    const pos = tasksByCol[columnId]?.length ?? 0;
    await createTask({ board_id: boardId, column_id: columnId, user_id: user.id, title: "New task", position: pos, priority: "medium", category_color: "slate" });
    qc.invalidateQueries({ queryKey: ["board", boardId] });
  };

  const handleAddColumn = async () => {
    if (!user || !boardId) return;
    const pos = data?.columns?.length ?? 0;
    await createColumn(boardId, user.id, "New column", pos);
    qc.invalidateQueries({ queryKey: ["board", boardId] });
  };

  if (loading || !data) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
          <span className="font-semibold">Flow</span>
        </Link>
        <nav className="space-y-1 text-sm">
          <button className="flex w-full items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 font-medium"><Layout className="h-4 w-4" /> Board</button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-sidebar-accent"><SettingsIcon className="h-4 w-4" /> Settings</button>
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-xl bg-sidebar-accent p-3 text-xs">
            <div className="flex items-center gap-2 font-medium"><HelpCircle className="h-4 w-4" /> Need help?</div>
            <p className="mt-1 text-muted-foreground">Ask the AI assistant anything.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-card p-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="truncate font-medium">{user?.email}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => signOut().then(() => nav({ to: "/" }))}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b px-6 py-4">
          {editingBoard ? (
            <Input
              autoFocus defaultValue={data.board.name}
              className="h-9 max-w-xs text-2xl font-semibold"
              onBlur={async (e) => { setEditingBoard(false); if (e.target.value && e.target.value !== data.board.name) { await renameBoard(data.board.id, e.target.value); qc.invalidateQueries({ queryKey: ["board", boardId] }); } }}
              onKeyDown={e => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            />
          ) : (
            <h1 onClick={() => setEditingBoard(true)} className="cursor-text text-2xl font-semibold tracking-tight">{data.board.name}</h1>
          )}
          <Button onClick={handleAddColumn} variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Add column</Button>
        </header>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-5">
              {data.columns.map(col => (
                <ColumnView
                  key={col.id}
                  column={col}
                  tasks={tasksByCol[col.id] ?? []}
                  commentCounts={commentCounts}
                  onAddTask={handleAddTask}
                  onTaskClick={setOpenTask}
                  onRename={async (id, name) => { await renameColumn(id, name); qc.invalidateQueries({ queryKey: ["board", boardId] }); }}
                  onDelete={async (id) => { await deleteColumn(id); qc.invalidateQueries({ queryKey: ["board", boardId] }); }}
                />
              ))}
              <button onClick={handleAddColumn} className="h-12 w-80 shrink-0 rounded-2xl border border-dashed text-sm text-muted-foreground hover:bg-accent/40">+ Add column</button>
            </div>
          </div>
          <DragOverlay>{activeTask && <TaskCard task={activeTask} isOverlay />}</DragOverlay>
        </DndContext>
      </main>

      <TaskDialog task={openTask} columns={data.columns} open={!!openTask} onOpenChange={(o) => !o && setOpenTask(null)} />
      {boardId && <AIAssistant boardId={boardId} />}
    </div>
  );
}
