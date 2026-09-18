-- Migration: Put "Size:" on a new line in product descriptions
-- Run this in Supabase SQL Editor

-- Update English descriptions: replace ". Size:" with ".\nSize:"
UPDATE products
SET description = REPLACE(description, '. Size:', '.\nSize:')
WHERE description LIKE '%. Size:%';

-- Update translations JSON: handle "Size:" in nested description fields
UPDATE products
SET translations = (
  SELECT jsonb_object_agg(
    key,
    CASE
      WHEN value->>'description' LIKE '%. Size:%'
      THEN jsonb_set(value, '{description}', to_jsonb(REPLACE(value->>'description', '. Size:', '.\nSize:')))
      WHEN value->>'short_description' LIKE '%Size:%'
      THEN jsonb_set(value, '{short_description}', to_jsonb(REPLACE(value->>'short_description', '. Size:', '.\nSize:')))
      ELSE value
    END
  )
  FROM jsonb_each(translations) AS t(key, value)
)
WHERE translations IS NOT NULL
  AND (
    translations::text LIKE '%. Size:%'
    OR translations::text LIKE '%Size:%'
  );
