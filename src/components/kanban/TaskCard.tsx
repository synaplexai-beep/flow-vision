import { format, parseISO } from "date-fns";
import { Calendar, Clock, MessageCircle, Flag } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/kanban-types";
import { PRIORITY_STYLE } from "@/lib/kanban-types";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onClick, commentCount = 0, isOverlay = false }: { task: Task; onClick?: () => void; commentCount?: number; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => { if (!isDragging) { e.stopPropagation(); onClick?.(); } }}
      className={cn(
        "group cursor-grab active:cursor-grabbing select-none rounded-2xl border bg-card p-4 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5",
        isDragging && "opacity-30",
        isOverlay && "shadow-lift rotate-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {task.category && (
          <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium", `tag-${task.category_color}`)}>
            {task.category}
          </span>
        )}
        <div className={cn("ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", PRIORITY_STYLE[task.priority])}>
          <Flag className="h-2.5 w-2.5" /> {task.priority}
        </div>
      </div>
      <h4 className="mt-3 font-medium leading-snug text-foreground">{task.title}</h4>
      {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {task.due_date && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <Calendar className="h-3 w-3" /> {format(parseISO(task.due_date), "MMM d")}
          </span>
        )}
        {task.estimated_hours != null && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <Clock className="h-3 w-3" /> {task.estimated_hours}h
          </span>
        )}
      </div>

      {(task.assignee_name || task.logged_hours > 0 || commentCount > 0) && (
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            {task.assignee_name && (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {task.assignee_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            {task.logged_hours > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
                <Clock className="h-2.5 w-2.5" /> {task.logged_hours}h
              </span>
            )}
          </div>
          {commentCount > 0 && (
            <span className="inline-flex items-center gap-1 text-muted-foreground"><MessageCircle className="h-3 w-3" /> {commentCount}</span>
          )}
        </div>
      )}
    </div>
  );
}
