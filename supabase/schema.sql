-- ELKASS 8.0 CLEAN CORE PRE-CLOUD
create table if not exists projects (id text primary key, name text, owner_email text, created_at timestamptz default now());
create table if not exists categories (id text primary key, project_id text default 'elkass', parent text, name text, icon text, description text, children jsonb default '[]'::jsonb, active boolean default true, home boolean default false);
create table if not exists products (id text primary key, project_id text default 'elkass', category text, name text, price text, oldPrice text, discount text, promo boolean default false, promoBadges jsonb default '[]'::jsonb, features jsonb default '[]'::jsonb, specs jsonb default '{}'::jsonb, description text, images jsonb default '[]'::jsonb, active boolean default true);
create table if not exists category_comments (id text primary key, project_id text default 'elkass', category text, author text, comment text, rating int default 5, active boolean default true);
create table if not exists settings (key text primary key, value jsonb);
insert into projects(id,name,owner_email) values ('elkass','ELKASS Olesno','woodyboy070@gmail.com') on conflict do nothing;
