-- ELKASS 8.5 Alpha / Supabase ready
create table if not exists projects (id text primary key, data jsonb);
create table if not exists products (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists categories (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists home_sections (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists reviews (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists brands (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists media_library (id text primary key, project_id text default 'elkass', data jsonb);
create table if not exists settings (key text primary key, value jsonb);
