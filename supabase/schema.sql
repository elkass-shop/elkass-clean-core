-- ELKASS 8.5 Beta / Supabase production structure

create table if not exists projects (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key,
  project_id text default 'elkass',
  email text,
  role text default 'EDITOR',
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key,
  project_id text default 'elkass',
  category text,
  active boolean default true,
  draft boolean default false,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id text primary key,
  project_id text default 'elkass',
  parent text,
  active boolean default true,
  data jsonb not null default '{}'::jsonb
);

create table if not exists home_sections (
  id text primary key,
  project_id text default 'elkass',
  sort_order int default 0,
  active boolean default true,
  pinned boolean default false,
  scheduled boolean default false,
  data jsonb not null default '{}'::jsonb
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  project_id text default 'elkass',
  type text default 'local',
  active boolean default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists brands (
  id text primary key,
  project_id text default 'elkass',
  active boolean default true,
  data jsonb not null default '{}'::jsonb
);

create table if not exists media_library (
  id uuid primary key default gen_random_uuid(),
  project_id text default 'elkass',
  original_path text,
  variants jsonb default '{}'::jsonb,
  assigned_to text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  project_id text default 'elkass',
  actor_email text,
  action text,
  entity_type text,
  entity_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);
