-- ELKASS 8.1 PREMIUM FOUNDATION STAGE I / Supabase ready

create table if not exists projects (
  id text primary key,
  name text not null,
  owner_email text,
  created_at timestamptz default now()
);

create table if not exists home_sections (
  id text primary key,
  project_id text default 'elkass',
  type text not null,
  title text,
  config jsonb default '{}'::jsonb,
  active boolean default true,
  sort_order int default 0
);

create table if not exists categories (
  id text primary key,
  project_id text default 'elkass',
  parent text,
  name text not null,
  icon text,
  description text,
  children jsonb default '[]'::jsonb,
  active boolean default true,
  home boolean default false
);

create table if not exists products (
  id text primary key,
  project_id text default 'elkass',
  category text,
  name text not null,
  price text,
  old_price text,
  discount text,
  status text default 'available',
  stock int default 0,
  promo boolean default false,
  promo_type text,
  featured boolean default false,
  badges jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  advisor text,
  description text,
  media jsonb default '{}'::jsonb,
  images jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists media_library (
  id text primary key,
  project_id text default 'elkass',
  original_path text,
  mime_type text,
  variants jsonb default '{}'::jsonb,
  assigned_to text,
  created_at timestamptz default now()
);

create table if not exists category_comments (
  id text primary key,
  project_id text default 'elkass',
  category text,
  author text,
  city text,
  comment text,
  rating int default 5,
  active boolean default true
);

create table if not exists settings (
  key text primary key,
  value jsonb
);

insert into projects(id,name,owner_email)
values ('elkass','ELKASS Olesno','woodyboy070@gmail.com')
on conflict (id) do nothing;
