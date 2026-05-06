import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Column, Task } from "@/lib/kanban-types";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface Props {
  column: Column;
  tasks: Task[];
  commentCounts: Record<string, number>;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ColumnView({ column, tasks, commentCounts, onAddTask, onTaskClick, onRename, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { columnId: column.id } });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);

  return (
    <div className="flex h-full w-80 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        {editing ? (
          <Input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => { setEditing(false); if (name.trim() && name !== column.name) onRename(column.id, name.trim()); }}
            onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { setName(column.name); setEditing(false); } }}
            className="h-8 max-w-[12rem]"
          />
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-md px-1 py-0.5 text-sm font-semibold hover:bg-accent">
            {column.name}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{tasks.length}</span>
          </button>
        )}
        <div className="flex items-center gap-0.5">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAddTask(column.id)}><Plus className="h-4 w-4" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}><Pencil className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(column.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete column</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 rounded-2xl p-2 transition-colors",
          isOver && "bg-accent/60 ring-2 ring-primary/20"
        )}
      >
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} commentCount={commentCounts[t.id] || 0} onClick={() => onTaskClick(t)} />
        ))}
        {tasks.length === 0 && (
          <button onClick={() => onAddTask(column.id)} className="rounded-xl border border-dashed py-8 text-sm text-muted-foreground hover:bg-accent/40">
            + Add a task
          </button>
        )}
      </div>
    </div>
  );
}
