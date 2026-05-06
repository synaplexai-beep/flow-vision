
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- boards
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.boards enable row level security;
create policy "boards owner all" on public.boards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.boards(user_id);

-- columns
create table public.board_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.board_columns enable row level security;
create policy "columns owner all" on public.board_columns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.board_columns(board_id);

-- tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.board_columns(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  category_color text default 'slate',
  due_date date,
  priority text default 'medium',
  assignee_name text,
  estimated_hours numeric,
  logged_hours numeric default 0,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tasks enable row level security;
create policy "tasks owner all" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.tasks(column_id);
create index on public.tasks(board_id);

-- comments
create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.task_comments enable row level security;
create policy "comments owner all" on public.task_comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.task_comments(task_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger boards_updated before update on public.boards for each row execute procedure public.set_updated_at();
create trigger tasks_updated before update on public.tasks for each row execute procedure public.set_updated_at();
