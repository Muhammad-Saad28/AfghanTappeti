-- ============================================================
-- AfghanTappeti.com — Full Database Migration
-- Aligned to Database.md (source of truth)
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Drop existing tables (development only)
drop table if exists public.product_collections cascade;
drop table if exists public.product_categories cascade;
drop table if exists public.product_images cascade;
drop table if exists public.order_items cascade;
drop table if exists public.reviews cascade;
drop table if exists public.orders cascade;
drop table if exists public.customers cascade;
drop table if exists public.blogs cascade;
drop table if exists public.homepage_sections cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.seo_metadata cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.collections cascade;
drop table if exists public.categories cascade;
drop table if exists public.products cascade;
drop table if exists public.sizes cascade;
drop table if exists public.shapes cascade;
drop table if exists public.colors cascade;
drop table if exists public.materials cascade;
drop table if exists public.origins cascade;
drop table if exists public.profiles cascade;

-- 0. Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. profiles (Database.md §5)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  avatar text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  is_active boolean not null default true,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. origins (Database.md §12)
create table if not exists public.origins (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- 3. materials (Database.md §13)
create table if not exists public.materials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- 4. colors (Database.md §14)
create table if not exists public.colors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  hex_code text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 5. sizes (Database.md §15)
create table if not exists public.sizes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  width_cm numeric(6,2),
  length_cm numeric(6,2),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. shapes (Database.md §16)
create table if not exists public.shapes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- 7. products (Database.md §6)
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  sku text unique not null,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price >= 0),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  weight numeric(8,2),
  origin_id uuid references public.origins(id) on delete set null,
  material_id uuid references public.materials(id) on delete set null,
  size_id uuid references public.sizes(id) on delete set null,
  shape_id uuid references public.shapes(id) on delete set null,
  primary_color_id uuid references public.colors(id) on delete set null,
  secondary_color_id uuid references public.colors(id) on delete set null,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  seo_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 8. product_images (Database.md §7)
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. categories (Database.md §8)
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. product_categories (Database.md §9)
create table if not exists public.product_categories (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade
);

-- 11. collections (Database.md §10)
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  banner_image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. product_collections (Database.md §11)
create table if not exists public.product_collections (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade
);

-- 13. customers (Database.md §17)
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 14. orders (Database.md §18)
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete set null,
  order_number text unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','paid','processing','shipped','delivered','cancelled','refunded')),
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  shipping_status text,
  tracking_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 15. order_items (Database.md §19)
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity int not null,
  price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- 16. reviews (Database.md §20)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  country text,
  rating int not null check (rating between 1 and 5),
  title text,
  review text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- 17. blogs (Database.md §21)
create table if not exists public.blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  seo_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 18. homepage_sections (Database.md §22)
create table if not exists public.homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  section_name text not null,
  title text,
  subtitle text,
  button_text text,
  button_link text,
  image text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 19. newsletter_subscribers (Database.md §23)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now()
);

-- 20. seo_metadata (Database.md §24)
create table if not exists public.seo_metadata (
  id uuid primary key default uuid_generate_v4(),
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  robots text,
  schema_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 21. site_settings (Database.md §25)
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text,
  tagline text,
  logo text,
  favicon text,
  contact_email text,
  phone text,
  whatsapp text,
  address text,
  facebook text,
  instagram text,
  youtube text,
  linkedin text,
  default_language text not null default 'en',
  currency text not null default 'EUR',
  timezone text not null default 'Europe/Rome',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes (Database.md §27)
-- ============================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_sku on public.products(sku);
create index if not exists idx_products_active on public.products(is_active) where is_active = true;
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_products_created on public.products(created_at);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_customers_email on public.customers(email);

-- ============================================================
-- Row Level Security (Database.md §32)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.categories enable row level security;
alter table public.product_categories enable row level security;
alter table public.collections enable row level security;
alter table public.product_collections enable row level security;
alter table public.origins enable row level security;
alter table public.materials enable row level security;
alter table public.colors enable row level security;
alter table public.sizes enable row level security;
alter table public.shapes enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.blogs enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.seo_metadata enable row level security;
alter table public.site_settings enable row level security;

-- Public read access to active products and related data
create policy "Public read — products"
  on public.products for select
  using (is_active = true and deleted_at is null);

create policy "Public read — product_images"
  on public.product_images for select
  using (exists (select 1 from public.products where id = product_id and is_active = true and deleted_at is null));

create policy "Public read — categories"
  on public.categories for select
  to public
  using (true);

create policy "Public read — collections"
  on public.collections for select
  to public
  using (true);

create policy "Public read — origins"
  on public.origins for select
  to public
  using (true);

create policy "Public read — materials"
  on public.materials for select
  to public
  using (true);

create policy "Public read — colors"
  on public.colors for select
  to public
  using (true);

create policy "Public read — sizes"
  on public.sizes for select
  to public
  using (true);

create policy "Public read — shapes"
  on public.shapes for select
  to public
  using (true);

create policy "Public read — reviews"
  on public.reviews for select
  using (is_approved = true);

create policy "Public read — blogs"
  on public.blogs for select
  using (status = 'published');

create policy "Public read — homepage_sections"
  on public.homepage_sections for select
  to public
  using (true);

create policy "Public read — seo_metadata"
  on public.seo_metadata for select
  to public
  using (true);

create policy "Public read — site_settings"
  on public.site_settings for select
  to public
  using (true);

-- Admin full CRUD
create policy "Admin all — profiles"
  on public.profiles for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — product_images"
  on public.product_images for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — product_categories"
  on public.product_categories for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — collections"
  on public.collections for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — product_collections"
  on public.product_collections for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — origins"
  on public.origins for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — materials"
  on public.materials for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — colors"
  on public.colors for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — sizes"
  on public.sizes for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — shapes"
  on public.shapes for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — customers"
  on public.customers for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — orders"
  on public.orders for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — order_items"
  on public.order_items for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — reviews"
  on public.reviews for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — blogs"
  on public.blogs for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — homepage_sections"
  on public.homepage_sections for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — newsletter_subscribers"
  on public.newsletter_subscribers for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — seo_metadata"
  on public.seo_metadata for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all — site_settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Seed data
-- ============================================================
insert into public.origins (name, slug) values
  ('Afghanistan', 'afghanistan'),
  ('Iran', 'iran'),
  ('Turkey', 'turkey'),
  ('Pakistan', 'pakistan'),
  ('India', 'india'),
  ('China', 'china')
on conflict (slug) do nothing;

insert into public.materials (name, slug) values
  ('Wool', 'wool'),
  ('Silk', 'silk'),
  ('Cotton', 'cotton'),
  ('Wool & Silk', 'wool-silk'),
  ('Viscose', 'viscose')
on conflict (slug) do nothing;

insert into public.shapes (name, slug) values
  ('Rectangle', 'rectangle'),
  ('Square', 'square'),
  ('Round', 'round'),
  ('Runner', 'runner'),
  ('Oval', 'oval')
on conflict (slug) do nothing;

-- Categories (Database.md §8)
insert into public.categories (name, slug, description, display_order, is_active) values
  ('Afghan Rugs', 'afghan-rugs', 'Traditional handmade Afghan rugs.', 1, true),
  ('Persian Rugs', 'persian-rugs', 'Authentic handmade Persian rugs.', 2, true),
  ('Runner Rugs', 'runner-rugs', 'Hand-knotted hallway runners.', 3, true),
  ('Kilim', 'kilim', 'Flatwoven handmade kilims.', 4, true),
  ('Vintage Rugs', 'vintage-rugs', 'Vintage handmade rugs.', 5, true),
  ('Modern Rugs', 'modern-rugs', 'Modern handmade rugs.', 6, true),
  ('Oriental Rugs', 'oriental-rugs', 'Authentic handmade Oriental rugs.', 7, true),
  ('Round Rugs', 'round-rugs', 'Hand-knotted round rugs.', 8, true),
  ('Luxury Rugs', 'luxury-rugs', 'Premium luxury handmade rugs.', 9, true)
on conflict (slug) do nothing;

-- Colors (Database.md §14)
insert into public.colors (name, hex_code, display_order) values
  ('Red', '#A32020', 1),
  ('Blue', '#1E4F91', 2),
  ('Navy', '#1F2E5A', 3),
  ('Ivory', '#F6F1E7', 4),
  ('Cream', '#F9F5E8', 5),
  ('Beige', '#D8C3A5', 6),
  ('Brown', '#7A5230', 7),
  ('Rust', '#A44A2A', 8),
  ('Terracotta', '#C96A3D', 9),
  ('Gold', '#C8A23A', 10),
  ('Green', '#4C7A4A', 11),
  ('Emerald', '#0F7C5A', 12),
  ('Turquoise', '#2AA6A6', 13),
  ('Sky Blue', '#7FB7E6', 14),
  ('Orange', '#D97A28', 15),
  ('Burgundy', '#6B1F2A', 16),
  ('Multicolor', '#999999', 17)
on conflict (name) do nothing;

-- Sizes (Database.md §15)
insert into public.sizes (name, width_cm, length_cm, display_order) values
  ('60 x 90 cm', 60, 90, 1),
  ('80 x 150 cm', 80, 150, 2),
  ('100 x 150 cm', 100, 150, 3),
  ('120 x 180 cm', 120, 180, 4),
  ('150 x 200 cm', 150, 200, 5),
  ('150 x 230 cm', 150, 230, 6),
  ('200 x 250 cm', 200, 250, 7),
  ('200 x 300 cm', 200, 300, 8),
  ('250 x 350 cm', 250, 350, 9),
  ('300 x 400 cm', 300, 400, 10),
  ('Runner 70 x 200 cm', 70, 200, 11),
  ('Runner 80 x 300 cm', 80, 300, 12)
on conflict (name) do nothing;

-- Collections (Database.md §10)
insert into public.collections (name, slug, description, is_active) values
  ('New Arrivals', 'new-arrivals', 'Our newest rug arrivals', true),
  ('Best Sellers', 'best-sellers', 'Our most popular rugs', true),
  ('Classic Collection', 'classic-collection', 'Timeless classic rug designs', true),
  ('Luxury Collection', 'luxury-collection', 'Premium luxury carpets', true),
  ('Artisan Collection', 'artisan-collection', 'Master artisan woven rugs', true),
  ('Heritage Collection', 'heritage-collection', 'Classic traditional rugs', true),
  ('Nomad Collection', 'nomad-collection', 'Nomadic tribal rugs', true),
  ('Royal Collection', 'royal-collection', 'Luxury handmade rugs', true),
  ('Silk Road Collection', 'silk-road-collection', 'Inspired by the Silk Road', true)
on conflict (slug) do nothing;

create or replace function public.decrement_stock(product_id uuid, quantity int)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set stock_quantity = stock_quantity - quantity
  where id = product_id and stock_quantity >= quantity;
end;
$$;
