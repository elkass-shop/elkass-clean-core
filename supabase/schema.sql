-- ELKASS 8.5 RC / Supabase Ready
create table if not exists projects (id text primary key, data jsonb);
create table if not exists profiles (id uuid primary key, email text, role text, project_id text default 'elkass');
create table if not exists products (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists categories (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists home_sections (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists reviews (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists brands (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists media_library (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists settings (key text primary key, value jsonb);
create table if not exists audit_log (id uuid primary key default gen_random_uuid(), actor_email text, action text, entity_type text, entity_id text, data jsonb, created_at timestamptz default now());
