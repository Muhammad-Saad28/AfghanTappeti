-- Migration: Add images to categories
-- Run this in Supabase SQL Editor

-- Update category images
UPDATE public.categories
SET image = '/AfghanRugs.jpeg',
    updated_at = now()
WHERE slug = 'afghan-rugs';

UPDATE public.categories
SET image = '/afghankilims.jpeg',
    updated_at = now()
WHERE slug = 'persian-rugs';

UPDATE public.categories
SET image = '/AfghanRugs.jpeg',
    updated_at = now()
WHERE slug = 'runner-rugs';

UPDATE public.categories
SET image = '/modernluxurykilims.jpeg',
    updated_at = now()
WHERE slug = 'kilim';

UPDATE public.categories
SET image = '/persianvintage.jpeg',
    updated_at = now()
WHERE slug = 'vintage-rugs';

UPDATE public.categories
SET image = '/modernluxurykilims.jpeg',
    updated_at = now()
WHERE slug = 'modern-rugs';
