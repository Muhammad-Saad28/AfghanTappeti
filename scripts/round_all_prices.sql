-- ============================================================
-- Round all prices to whole numbers
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Round product prices
UPDATE products SET price = ROUND(price) WHERE price IS NOT NULL;
UPDATE products SET sale_price = ROUND(sale_price) WHERE sale_price IS NOT NULL;

-- Round order totals
UPDATE orders SET subtotal = ROUND(subtotal);
UPDATE orders SET shipping_cost = ROUND(shipping_cost);
UPDATE orders SET discount = ROUND(discount);
UPDATE orders SET tax = ROUND(tax);
UPDATE orders SET total = ROUND(total);

-- Round order item prices
UPDATE order_items SET price = ROUND(price);
UPDATE order_items SET subtotal = ROUND(subtotal);

-- Verify: check for any remaining decimals
SELECT 'products.price' as tbl, COUNT(*) as has_decimals FROM products WHERE price != ROUND(price)
UNION ALL
SELECT 'products.sale_price', COUNT(*) FROM products WHERE sale_price IS NOT NULL AND sale_price != ROUND(sale_price)
UNION ALL
SELECT 'orders.subtotal', COUNT(*) FROM orders WHERE subtotal != ROUND(subtotal)
UNION ALL
SELECT 'orders.total', COUNT(*) FROM orders WHERE total != ROUND(total)
UNION ALL
SELECT 'order_items.price', COUNT(*) FROM order_items WHERE price != ROUND(price)
UNION ALL
SELECT 'order_items.subtotal', COUNT(*) FROM order_items WHERE subtotal != ROUND(subtotal);
