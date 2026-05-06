
# Kanban Board with AI Assistant

A polished, interactive Kanban app inspired by the reference images — soft neutral background, glassy white cards with subtle shadows, pill-shaped category tags, rounded avatars, and a clean left sidebar. Each user signs in to manage their own private boards, and an AI assistant in a side panel can answer questions and take actions on the board.

## Design language

Drawing from both reference images:
- Soft off-white/light gradient background, generous whitespace
- White cards with very soft shadows + subtle border, rounded-xl corners
- Pill tags for category (e.g. "Wireframes", "Design", "Media") in muted colors
- Small avatar in card corner, footer chips for due date, time estimate, comments, time logged
- Sidebar: app logo, primary nav (Board, Settings), a "Need support?" card, user profile at bottom
- Subtle hover lift, smooth drag animation, column drop highlights
- Light/dark theme toggle

## Core features

### Authentication
- Email/password and Google sign-in (Lovable Cloud)
- Each user has their own private boards and tasks
- Login/signup pages with the same visual style
- Profile menu with sign out

### Boards & columns (fully customizable)
- Create multiple boards; switch via sidebar dropdown
- Rename board, delete board
- Add / rename / reorder / delete columns
- Each column shows task count and "+" to add task

### Task cards (full feature set)
- Title, description (rich text)
- Category tag (with color)
- Due date
- Assignee (avatar) — from people you add to the board
- Priority (Low / Medium / High / Urgent) with color indicator
- Estimated hours + time logged
- Comments (count visible, full thread in detail view)
- Drag-and-drop between columns and reorder within a column
- Click card → opens detail dialog with all fields editable
- Quick actions: duplicate, delete, move to column

### AI Assistant (side panel, board-aware + can take actions)
- Slide-out chat panel triggered from a floating button
- Streaming responses, markdown rendering
- Has full context of the current board (columns, tasks, due dates, status)
- Can answer questions: "What's overdue?", "Summarize my week", "Which tasks need review?"
- Can take actions via tool calling:
  - Create task in a column
  - Move task between columns
  - Update task fields (due date, priority, assignee, status)
  - Delete task
  - Create / rename column
- After each action, the board updates instantly and the assistant confirms what it did

### Persistence
- Everything saves automatically to the database as you work (no manual save button)
- Returning users see all their boards/tasks intact
- Optimistic UI updates with rollback on error

## Pages

- `/` — Marketing landing → CTA to sign up / log in
- `/login`, `/signup` — Auth pages
- `/board` — Default board view (redirects to last opened board)
- `/board/$boardId` — Specific board with Kanban columns + AI panel

## Technical notes

- Database tables: `profiles`, `boards`, `columns`, `tasks`, `comments`, `board_members` (for future collaboration), all with RLS scoped to `auth.uid()`
- Drag-and-drop via `@dnd-kit` (smooth, accessible, touch-friendly)
- AI: Lovable AI Gateway with `google/gemini-3-flash-preview`; tool-calling for board actions; streaming via server function/edge function; conversation history kept in memory per session
- Server functions (`createServerFn`) for all CRUD; `requireSupabaseAuth` middleware so RLS scopes data to the user
- React Query for client cache + optimistic mutations
- shadcn components (Dialog, Popover, DropdownMenu, Sheet for AI panel, Sonner for toasts)

## Out of scope (can add later)
- Sharing boards / multi-user collaboration
- File attachments on tasks
- List / Gantt / Calendar / Table views (board view only for v1)
- Notifications / email reminders
