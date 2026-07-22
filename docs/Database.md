Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Database Design Document

Related Documents

- PRD.md
- Architecture.md
- Rules.md

---

# 1. Purpose

This document defines the complete database architecture of Afghan Tappeti.

This document is the ONLY source of truth regarding:

- Tables
- Columns
- Relationships
- Constraints
- Indexes
- Data Integrity

No AI or developer may invent new tables or columns without explicit approval.

---

# 2. Database Principles

The database must satisfy the following principles:

- Single Source of Truth
- Normalized where practical
- Avoid duplicate data
- Scalable to 10,000+ products
- Human-readable naming
- UUID primary keys
- Automatic timestamps
- Soft deletion where appropriate
- Referential integrity
- Secure by default

---

# 3. Naming Conventions

Tables

snake_case
Plural names

Example

products
categories
orders

Columns

snake_case

Example

created_at
sale_price

Primary Key

id

Foreign Keys

product_id
category_id

Timestamp Columns

created_at
updated_at

Boolean Prefix

is_

Examples

is_featured
is_active

---

# 4. Core Tables

The platform consists of the following core entities.

Authentication

profiles

Catalog

products
categories
collections
materials
origins
colors
sizes
shapes

Relationships

product_categories
product_collections

Media

product_images

Commerce

customers
orders
order_items

Content

homepage_sections
blogs
reviews
newsletter_subscribers

SEO

seo_metadata

Settings

site_settings

---

# 5. profiles

Purpose

Stores administrator information.

Fields

id
email
full_name
avatar
role
is_active
last_login
created_at
updated_at

Notes

Currently only one administrator is planned.

Architecture must support multiple administrators in the future.

---

# 6. products

Purpose

Main catalog table.

Fields

id

name

slug

short_description

description

sku

price

sale_price

stock_quantity

weight

origin_id

material_id

size_id

shape_id

primary_color_id

secondary_color_id

is_featured

is_best_seller

is_active

seo_id

created_at

updated_at

deleted_at

---

# 7. product_images

Purpose

Supports multiple images per product.

Fields

id

product_id

image_url

alt_text

display_order

is_primary

created_at

updated_at

Rules

Each product

Minimum

1 image

Recommended

5 images

Only one image may be primary.

---

# 8. categories

Purpose

Product categorization.

Fields

id

name

slug

description

image

display_order

is_active

created_at

updated_at

Examples

Persian

Oriental

Afghan

Vintage

Modern

Runner

Luxury

---

# 9. product_categories

Purpose

Many-to-many relationship.

Fields

id

product_id

category_id

---

# 10. collections

Purpose

Special product collections.

Examples

New Arrivals

Best Sellers

Classic Collection

Luxury Collection

Fields

id

name

slug

description

banner_image

is_active

created_at

updated_at

---

# 11. product_collections

Purpose

Many-to-many relationship.

Fields

id

product_id

collection_id

---

# 12. origins

Examples

Afghanistan

Iran

Pakistan

Turkey

India

Fields

id

name

slug

description

---

# 13. materials

Examples

Wool

Silk

Cotton

Fields

id

name

slug

description

---

# 14. colors

Purpose

Color filters.

Fields

id

name

hex_code

display_order

---

# 15. sizes

Purpose

Physical dimensions.

Fields

id

name

width_cm

length_cm

display_order

Example

200 x 300

---

# 16. shapes

Examples

Rectangle

Round

Runner

Square

Oval

---

# 17. customers

Fields

id

first_name

last_name

email

phone

created_at

updated_at

---

# 18. orders

Fields

id

customer_id

order_number

status

subtotal

shipping_cost

discount

tax

total

payment_status

shipping_status

tracking_number

notes

created_at

updated_at

Statuses

Pending

Confirmed

Paid

Processing

Shipped

Delivered

Cancelled

Refunded

---

# 19. order_items

Fields

id

order_id

product_id

quantity

price

subtotal

---

# 20. reviews

Fields

id

product_id

customer_name

country

rating

title

review

is_approved

created_at

---

# 21. blogs

Fields

id

title

slug

excerpt

content

featured_image

status

published_at

seo_id

created_at

updated_at

Status

Draft

Published

Archived

---

# 22. homepage_sections

Purpose

Dynamic homepage.

Fields

id

section_name

title

subtitle

button_text

button_link

image

display_order

is_active

Every homepage section should be editable from the admin panel.

---

# 23. newsletter_subscribers

Fields

id

email

is_active

subscribed_at

---

# 24. seo_metadata

Fields

id

meta_title

meta_description

canonical_url

og_title

og_description

og_image

robots

schema_json

---

# 25. site_settings

Purpose

Global settings.

Fields

site_name

tagline

logo

favicon

contact_email

phone

address

facebook

instagram

youtube

linkedin

default_language

currency

timezone

---

# 26. Relationships

products

↓

product_images

1 → many

products

↓

reviews

1 → many

products

↓

categories

many ↔ many

products

↓

collections

many ↔ many

customers

↓

orders

1 → many

orders

↓

order_items

1 → many

products

↓

order_items

1 → many

---

# 27. Indexes

Index

slug

sku

email

order_number

category_id

collection_id

created_at

status

---

# 28. Constraints

SKU

Unique

Slug

Unique

Email

Unique

Order Number

Unique

Price

Cannot be negative

Stock

Cannot be negative

Rating

1–5

---

# 29. Soft Delete Strategy

Products

Use deleted_at

Never permanently delete unless explicitly requested.

Orders

Never deleted.

Customers

Soft delete.

Blogs

Soft delete.

---

# 30. Media Strategy

Images are stored separately.

Database stores URLs only.

Never store binary files inside PostgreSQL.

---

# 31. Future Expansion

Architecture supports

Gift Cards

Coupons

Multiple Warehouses

Inventory Tracking

Trade Accounts

Designer Accounts

Multiple Languages

Additional Payment Methods

Without restructuring existing tables.

---

# 32. Row Level Security

Public

Read-only access to active products.

Admin

Full CRUD.

Customers

Only access their own account and orders.

---

# 33. Acceptance Criteria

Database is complete when

✓ Products support multiple images

✓ Products support multiple categories

✓ Products support multiple collections

✓ Orders are normalized

✓ SEO data exists

✓ Homepage is editable

✓ Future expansion is supported

✓ Referential integrity maintained

---

# 34. Final Statement

The database is the foundation of Afghan Tappeti.

All business logic, user interfaces, APIs, and admin functionality must rely on this schema.

No developer or AI assistant may introduce undocumented tables, columns, or relationships without updating this document and receiving approval.