-- Fix 2+11: Contact messages table
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Public insert — contact_messages" on public.contact_messages;
create policy "Public insert — contact_messages"
  on public.contact_messages for insert
  to public
  with check (true);

drop policy if exists "Admin all — contact_messages" on public.contact_messages;
create policy "Admin all — contact_messages"
  on public.contact_messages for all
  to authenticated
  using (true);

-- Fix 3: Soft delete for customers
alter table public.customers add column if not exists deleted_at timestamptz;

-- Fix 10: Blog categories
create table if not exists public.blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.blog_categories enable row level security;

drop policy if exists "Public read — blog_categories" on public.blog_categories;
create policy "Public read — blog_categories"
  on public.blog_categories for select
  to public
  using (true);

drop policy if exists "Admin all — blog_categories" on public.blog_categories;
create policy "Admin all — blog_categories"
  on public.blog_categories for all
  to authenticated
  using (true);

alter table public.blogs add column if not exists category_id uuid references public.blog_categories(id) on delete set null;
