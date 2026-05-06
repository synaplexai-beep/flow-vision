import { supabase } from "@/integrations/supabase/client";
import type { Board, Column, Task, Comment } from "./kanban-types";

export async function listBoards(): Promise<Board[]> {
  const { data, error } = await supabase.from("boards").select("*").order("position");
  if (error) throw error;
  return data as Board[];
}

export async function ensureFirstBoard(userId: string): Promise<Board> {
  const boards = await listBoards();
  if (boards.length) return boards[0];
  const { data, error } = await supabase.from("boards").insert({ user_id: userId, name: "My Board", position: 0 }).select().single();
  if (error) throw error;
  // seed default columns
  const cols = ["To-do", "In Progress", "Review", "Completed"];
  await supabase.from("board_columns").insert(cols.map((name, i) => ({ board_id: data.id, user_id: userId, name, position: i })));
  return data as Board;
}

export async function getBoardData(boardId: string): Promise<{ board: Board; columns: Column[]; tasks: Task[] }> {
  const [b, c, t] = await Promise.all([
    supabase.from("boards").select("*").eq("id", boardId).single(),
    supabase.from("board_columns").select("*").eq("board_id", boardId).order("position"),
    supabase.from("tasks").select("*").eq("board_id", boardId).order("position"),
  ]);
  if (b.error) throw b.error; if (c.error) throw c.error; if (t.error) throw t.error;
  return { board: b.data as Board, columns: c.data as Column[], tasks: t.data as Task[] };
}

export async function createColumn(boardId: string, userId: string, name: string, position: number) {
  const { data, error } = await supabase.from("board_columns").insert({ board_id: boardId, user_id: userId, name, position }).select().single();
  if (error) throw error;
  return data as Column;
}
export async function renameColumn(id: string, name: string) {
  const { error } = await supabase.from("board_columns").update({ name }).eq("id", id);
  if (error) throw error;
}
export async function deleteColumn(id: string) {
  const { error } = await supabase.from("board_columns").delete().eq("id", id);
  if (error) throw error;
}

export async function createTask(input: Partial<Task> & { board_id: string; column_id: string; user_id: string; title: string; position: number; }) {
  const { data, error } = await supabase.from("tasks").insert(input).select().single();
  if (error) throw error;
  return data as Task;
}
export async function updateTask(id: string, patch: Partial<Task>) {
  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
export async function moveTask(id: string, columnId: string, position: number) {
  const { error } = await supabase.from("tasks").update({ column_id: columnId, position }).eq("id", id);
  if (error) throw error;
}

export async function listComments(taskId: string): Promise<Comment[]> {
  const { data, error } = await supabase.from("task_comments").select("*").eq("task_id", taskId).order("created_at");
  if (error) throw error;
  return data as Comment[];
}
export async function addComment(taskId: string, userId: string, body: string) {
  const { error } = await supabase.from("task_comments").insert({ task_id: taskId, user_id: userId, body });
  if (error) throw error;
}

export async function renameBoard(id: string, name: string) {
  const { error } = await supabase.from("boards").update({ name }).eq("id", id);
  if (error) throw error;
}
