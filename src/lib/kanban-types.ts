export type Priority = "low" | "medium" | "high" | "urgent";
export type TagColor = "blue" | "violet" | "pink" | "amber" | "emerald" | "slate";

export interface Board { id: string; user_id: string; name: string; position: number; }
export interface Column { id: string; board_id: string; name: string; position: number; }
export interface Task {
  id: string;
  column_id: string;
  board_id: string;
  title: string;
  description: string | null;
  category: string | null;
  category_color: TagColor;
  due_date: string | null;
  priority: Priority;
  assignee_name: string | null;
  estimated_hours: number | null;
  logged_hours: number;
  position: number;
}
export interface Comment { id: string; task_id: string; body: string; created_at: string; }

export const TAG_COLORS: TagColor[] = ["blue", "violet", "pink", "amber", "emerald", "slate"];
export const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];
export const PRIORITY_STYLE: Record<Priority, string> = {
  low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  medium: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  high: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  urgent: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};
