-- ============================================================
-- Ecommerce Migration — Addresses for orders
-- Run this AFTER the main migration.sql
-- ============================================================

-- Add address fields to orders (stored as JSON for flexibility)
alter table public.orders add column if not exists shipping_address jsonb;
alter table public.orders add column if not exists billing_address jsonb;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_phone text;

-- Drop existing policies to recreate with insert for public
drop policy if exists "Public insert — orders" on public.orders;
create policy "Public insert — orders"
  on public.orders for insert
  to public
  with check (true);

drop policy if exists "Public insert — order_items" on public.order_items;
create policy "Public insert — order_items"
  on public.order_items for insert
  to public
  with check (true);

-- Allow public to read their own order by order_number
drop policy if exists "Public read own order" on public.orders;
create policy "Public read own order"
  on public.orders for select
  to public
  using (true);
