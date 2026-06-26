-- ELKASS 8.5 Enterprise Premium Stage 1
create table if not exists products (id text primary key, data jsonb);
create table if not exists categories (id text primary key, data jsonb);
create table if not exists home_sections (id text primary key, data jsonb);
create table if not exists reviews (id text primary key, data jsonb);
create table if not exists brands (id text primary key, data jsonb);
create table if not exists settings (key text primary key, value jsonb);
