-- Migration: Fix products with missing size_id
-- Run this in Supabase SQL Editor
-- This script tries to match products to sizes based on dimensions in description

-- Step 1: Update products where description contains "WxH cm" pattern
UPDATE products p
SET size_id = s.id
FROM sizes s
WHERE p.size_id IS NULL
  AND s.width_cm IS NOT NULL
  AND (
    -- Match "Size: 200x300 cm" or "200x300" patterns in description
    p.description ILIKE '%' || s.width_cm || 'x' || s.length_cm || '%'
    OR p.description ILIKE '%' || s.length_cm || 'x' || s.width_cm || '%'
    OR p.short_description ILIKE '%' || s.width_cm || 'x' || s.length_cm || '%'
    OR p.short_description ILIKE '%' || s.length_cm || 'x' || s.width_cm || '%'
  );

-- Step 2: Show remaining products without sizes (for manual review)
SELECT p.sku, p.name, p.description
FROM products p
WHERE p.size_id IS NULL
  AND p.deleted_at IS NULL
ORDER BY p.sku;
