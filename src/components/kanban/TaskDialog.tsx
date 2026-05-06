import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash2, Send } from "lucide-react";
import type { Task } from "@/lib/kanban-types";
import { TAG_COLORS, PRIORITIES } from "@/lib/kanban-types";
import { listComments, addComment, updateTask, deleteTask } from "@/lib/kanban-api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TaskDialog({
  task, columns, open, onOpenChange,
}: {
  task: Task | null;
  columns: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Task | null>(task);
  const [comment, setComment] = useState("");

  useEffect(() => { setDraft(task); }, [task]);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", task?.id],
    queryFn: () => listComments(task!.id),
    enabled: !!task && open,
  });

  const save = useMutation({
    mutationFn: async (patch: Partial<Task>) => updateTask(task!.id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["board", task?.board_id] });
    },
  });

  const del = useMutation({
    mutationFn: async () => deleteTask(task!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["board", task?.board_id] });
      onOpenChange(false);
      toast.success("Task deleted");
    },
  });

  const sendComment = async () => {
    if (!comment.trim() || !user || !task) return;
    await addComment(task.id, user.id, comment.trim());
    setComment("");
    qc.invalidateQueries({ queryKey: ["comments", task.id] });
    qc.invalidateQueries({ queryKey: ["comment-counts", task.board_id] });
  };

  if (!draft) return null;

  const update = (patch: Partial<Task>) => {
    setDraft({ ...draft, ...patch });
    save.mutate(patch);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="sr-only">Task</DialogTitle></DialogHeader>

        <div className="space-y-5">
          <Input
            value={draft.title}
            onChange={e => setDraft({ ...draft, title: e.target.value })}
            onBlur={() => draft.title !== task?.title && update({ title: draft.title })}
            className="border-0 px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={draft.column_id} onValueChange={v => update({ column_id: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{columns.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select value={draft.priority} onValueChange={v => update({ priority: v as Task["priority"] })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Due date</Label>
              <Input type="date" value={draft.due_date ?? ""} onChange={e => update({ due_date: e.target.value || null })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Assignee</Label>
              <Input value={draft.assignee_name ?? ""} onChange={e => setDraft({ ...draft, assignee_name: e.target.value })} onBlur={() => update({ assignee_name: draft.assignee_name })} placeholder="Name" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Estimated (h)</Label>
              <Input type="number" min={0} step={0.5} value={draft.estimated_hours ?? ""} onChange={e => setDraft({ ...draft, estimated_hours: e.target.value ? Number(e.target.value) : null })} onBlur={() => update({ estimated_hours: draft.estimated_hours })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Logged (h)</Label>
              <Input type="number" min={0} step={0.5} value={draft.logged_hours ?? 0} onChange={e => setDraft({ ...draft, logged_hours: Number(e.target.value) })} onBlur={() => update({ logged_hours: draft.logged_hours })} className="mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Category</Label>
            <div className="mt-1 flex gap-2">
              <Input value={draft.category ?? ""} onChange={e => setDraft({ ...draft, category: e.target.value })} onBlur={() => update({ category: draft.category })} placeholder="e.g. Design" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TAG_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => update({ category_color: c })}
                  className={cn("rounded-full px-3 py-1 text-[11px] capitalize", `tag-${c}`, draft.category_color === c && "ring-2 ring-foreground/40")}
                >{c}</button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              rows={4}
              value={draft.description ?? ""}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              onBlur={() => update({ description: draft.description })}
              className="mt-1"
              placeholder="Add a description…"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Comments</Label>
            <div className="mt-2 space-y-2">
              {comments.map(c => (
                <div key={c.id} className="rounded-lg bg-muted px-3 py-2 text-sm">{c.body}</div>
              ))}
              {comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet.</p>}
            </div>
            <div className="mt-2 flex gap-2">
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment…" onKeyDown={e => e.key === "Enter" && sendComment()} />
              <Button size="icon" onClick={sendComment}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="text-destructive" onClick={() => del.mutate()}><Trash2 className="mr-2 h-4 w-4" /> Delete task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
