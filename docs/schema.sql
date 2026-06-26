-- Supabase schema
create table if not exists quizzes (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null,
  student jsonb,
  answers jsonb,
  score numeric,
  created_at timestamptz default now()
);

alter table quizzes enable row level security;
alter table attempts enable row level security;

-- Demo policies. Tighten these before production.
create policy "Public read quizzes" on quizzes for select using (true);
create policy "Public insert attempts" on attempts for insert with check (true);
