ALTER TABLE products ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE origins ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE colors ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE sizes ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE shapes ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';

-- Customer accounts: link customers table to Supabase Auth
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id uuid unique references auth.users(id) on delete cascade;

COMMENT ON COLUMN products.translations IS '{"it": {"name": "...", "short_description": "...", "description": "..."}}';
COMMENT ON COLUMN categories.translations IS '{"it": {"name": "...", "description": "..."}}';
COMMENT ON COLUMN collections.translations IS '{"it": {"name": "...", "description": "..."}}';
COMMENT ON COLUMN blogs.translations IS '{"it": {"title": "...", "excerpt": "...", "content": "..."}}';
COMMENT ON COLUMN blog_categories.translations IS '{"it": {"name": "...", "description": "..."}}';
COMMENT ON COLUMN origins.translations IS '{"it": {"name": "..."}}';
COMMENT ON COLUMN materials.translations IS '{"it": {"name": "..."}}';
COMMENT ON COLUMN colors.translations IS '{"it": {"name": "..."}}';
COMMENT ON COLUMN sizes.translations IS '{"it": {"name": "..."}}';
COMMENT ON COLUMN shapes.translations IS '{"it": {"name": "..."}}';
