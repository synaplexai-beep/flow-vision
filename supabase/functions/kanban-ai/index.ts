import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You are Flow, an AI assistant embedded in a Kanban board app.
You help the user manage their board. You can answer questions about their tasks
and you can take actions via tools: create_task, update_task, move_task, delete_task,
create_column, rename_column.

Always think about which column to put a task in based on the user's intent. Use
the column ids from the provided board context. When you take an action, briefly
confirm what you did. Be concise and friendly. Format responses in markdown.`;

const tools = [
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a task in a column",
      parameters: {
        type: "object",
        properties: {
          column_id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          category_color: { type: "string", enum: ["blue", "violet", "pink", "amber", "emerald", "slate"] },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          due_date: { type: "string", description: "YYYY-MM-DD" },
          assignee_name: { type: "string" },
          estimated_hours: { type: "number" },
        },
        required: ["column_id", "title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description: "Update fields on an existing task",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          due_date: { type: "string" },
          assignee_name: { type: "string" },
          estimated_hours: { type: "number" },
          logged_hours: { type: "number" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_task",
      description: "Move a task to another column",
      parameters: {
        type: "object",
        properties: { task_id: { type: "string" }, column_id: { type: "string" } },
        required: ["task_id", "column_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_task",
      description: "Delete a task",
      parameters: { type: "object", properties: { task_id: { type: "string" } }, required: ["task_id"] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_column",
      description: "Create a new column on the board",
      parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
    },
  },
  {
    type: "function",
    function: {
      name: "rename_column",
      description: "Rename an existing column",
      parameters: { type: "object", properties: { column_id: { type: "string" }, name: { type: "string" } }, required: ["column_id", "name"] },
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = userData.user.id;

    const { messages, board_id } = await req.json();

    // load board context
    const [{ data: cols }, { data: tasks }] = await Promise.all([
      supabase.from("board_columns").select("id,name,position").eq("board_id", board_id).order("position"),
      supabase.from("tasks").select("id,column_id,title,priority,due_date,assignee_name,category,description,logged_hours,estimated_hours").eq("board_id", board_id),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const context = `Today is ${today}. Board context (JSON):\n` + JSON.stringify({ columns: cols, tasks });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let workingMessages = [
      { role: "system", content: SYSTEM },
      { role: "system", content: context },
      ...messages,
    ];

    const actionsTaken: { name: string; args: Record<string, unknown> }[] = [];

    // tool loop (max 5 iters)
    for (let iter = 0; iter < 5; iter++) {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: workingMessages,
          tools,
          tool_choice: "auto",
        }),
      });

      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (!aiResp.ok) {
        const t = await aiResp.text();
        return new Response(JSON.stringify({ error: `AI error: ${t}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const data = await aiResp.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;

      const toolCalls = msg.tool_calls ?? [];
      if (toolCalls.length === 0) {
        return new Response(JSON.stringify({ reply: msg.content ?? "", actions: actionsTaken }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      workingMessages.push(msg);

      for (const tc of toolCalls) {
        const name = tc.function.name;
        const args = JSON.parse(tc.function.arguments || "{}");
        let result: Record<string, unknown> = { ok: true };
        try {
          if (name === "create_task") {
            const colId = args.column_id;
            const { data: maxRow } = await supabase.from("tasks").select("position").eq("column_id", colId).order("position", { ascending: false }).limit(1).maybeSingle();
            const pos = (maxRow?.position ?? -1) + 1;
            const { data: t, error } = await supabase.from("tasks").insert({
              column_id: colId, board_id, user_id: userId,
              title: args.title, description: args.description ?? null,
              category: args.category ?? null, category_color: args.category_color ?? "slate",
              priority: args.priority ?? "medium", due_date: args.due_date ?? null,
              assignee_name: args.assignee_name ?? null, estimated_hours: args.estimated_hours ?? null,
              position: pos,
            }).select().single();
            if (error) throw error;
            result = { ok: true, task: t };
          } else if (name === "update_task") {
            const { task_id, ...patch } = args;
            const { error } = await supabase.from("tasks").update(patch).eq("id", task_id);
            if (error) throw error;
          } else if (name === "move_task") {
            const { data: maxRow } = await supabase.from("tasks").select("position").eq("column_id", args.column_id).order("position", { ascending: false }).limit(1).maybeSingle();
            const pos = (maxRow?.position ?? -1) + 1;
            const { error } = await supabase.from("tasks").update({ column_id: args.column_id, position: pos }).eq("id", args.task_id);
            if (error) throw error;
          } else if (name === "delete_task") {
            const { error } = await supabase.from("tasks").delete().eq("id", args.task_id);
            if (error) throw error;
          } else if (name === "create_column") {
            const { data: maxRow } = await supabase.from("board_columns").select("position").eq("board_id", board_id).order("position", { ascending: false }).limit(1).maybeSingle();
            const pos = (maxRow?.position ?? -1) + 1;
            const { data: c, error } = await supabase.from("board_columns").insert({ board_id, user_id: userId, name: args.name, position: pos }).select().single();
            if (error) throw error;
            result = { ok: true, column: c };
          } else if (name === "rename_column") {
            const { error } = await supabase.from("board_columns").update({ name: args.name }).eq("id", args.column_id);
            if (error) throw error;
          }
          actionsTaken.push({ name, args });
        } catch (err) {
          result = { ok: false, error: (err as Error).message };
        }
        workingMessages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
      }
    }

    return new Response(JSON.stringify({ reply: "Done.", actions: actionsTaken }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
