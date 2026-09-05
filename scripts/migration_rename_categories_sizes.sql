-- Migration: Rename categories and update sizes
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. Rename categories (displayed on homepage as Featured Collections)
-- ============================================================

-- Persian Rugs → Afghan Kilims
UPDATE public.categories
SET name = 'Afghan Kilims',
    description = 'Handwoven Afghan kilims with bold geometric patterns.',
    updated_at = now()
WHERE slug = 'persian-rugs';

-- Runner Rugs → Afghan Royal Sultani
UPDATE public.categories
SET name = 'Afghan Royal Sultani',
    description = 'Authentic Afghan Royal Sultani hand-knotted rugs.',
    updated_at = now()
WHERE slug = 'runner-rugs';

-- Kilim → Afghan Modern Kilims
UPDATE public.categories
SET name = 'Afghan Modern Kilims',
    description = 'Contemporary Afghan kilims with modern geometric designs.',
    updated_at = now()
WHERE slug = 'kilim';

-- Vintage Rugs → Persian Vintage Rugs
UPDATE public.categories
SET name = 'Persian Vintage Rugs',
    description = 'Timeless Persian vintage rugs with distressed patina and historical character.',
    updated_at = now()
WHERE slug = 'vintage-rugs';

-- Modern Rugs → Sultani Gabeh
UPDATE public.categories
SET name = 'Sultani Gabeh',
    description = 'Handcrafted Sultani Gabeh rugs with rich textures and warm tones.',
    updated_at = now()
WHERE slug = 'modern-rugs';

-- Update the Italian translations for renamed categories
UPDATE public.categories
SET translations = jsonb_set(
  translations,
  '{it, name}',
  '"Afghan Kilims"'
)
WHERE slug = 'persian-rugs';

UPDATE public.categories
SET translations = jsonb_set(
  translations,
  '{it, name}',
  '"Afghan Royal Sultani"'
)
WHERE slug = 'runner-rugs';

UPDATE public.categories
SET translations = jsonb_set(
  translations,
  '{it, name}',
  '"Afghan Modern Kilims"'
)
WHERE slug = 'kilim';

UPDATE public.categories
SET translations = jsonb_set(
  translations,
  '{it, name}',
  '"Persian Vintage Rugs"'
)
WHERE slug = 'vintage-rugs';

UPDATE public.categories
SET translations = jsonb_set(
  translations,
  '{it, name}',
  '"Sultani Gabeh"'
)
WHERE slug = 'modern-rugs';

-- ============================================================
-- 2. Replace sizes with the new list
-- ============================================================

-- Delete all existing sizes
DELETE FROM public.sizes;

-- Insert the new sizes in the correct order
INSERT INTO public.sizes (name, width_cm, length_cm, display_order) VALUES
  ('60 x 200 cm', 60, 200, 1),
  ('100 x 150 cm', 100, 150, 2),
  ('120 x 200 cm', 120, 200, 3),
  ('150 x 200 cm', 150, 200, 4),
  ('150 x 230 cm', 150, 230, 5),
  ('170 x 230 cm', 170, 230, 6),
  ('250 x 300 cm', 250, 300, 7),
  ('200 x 300 cm', 200, 300, 8),
  ('250 x 350 cm', 250, 350, 9),
  ('300 x 400 cm', 300, 400, 10),
  ('Runner 80 x 300 cm', 80, 300, 11),
  ('Other Sizes', null, null, 12);
