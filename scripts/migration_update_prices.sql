-- ============================================================
-- Update all product prices based on size dimensions
-- Formula: ROUND(ROUND((width_cm / 100) * (length_cm / 100), 2) * 310)
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Update prices for all products that have a size assigned
UPDATE products p
SET price = ROUND(ROUND((s.width_cm / 100) * (s.length_cm / 100), 2) * 310)
FROM sizes s
WHERE p.size_id = s.id;

-- Verify the updates
SELECT 
  p.name,
  p.sku,
  s.name as size_name,
  s.width_cm,
  s.length_cm,
  p.price,
  ROUND(ROUND((s.width_cm / 100) * (s.length_cm / 100), 2) * 310) as calculated_price
FROM products p
JOIN sizes s ON p.size_id = s.id
WHERE p.deleted_at IS NULL
ORDER BY s.display_order, p.name;
