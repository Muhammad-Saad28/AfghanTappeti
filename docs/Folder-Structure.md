Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Folder Structure Documentation

Related Documents

- PRD.md
- Architecture.md
- Database.md
- Rules.md

---

# 1. Purpose

This document defines the official folder and file organization of Afghan Tappeti.

The goals are:

- Maintain consistency
- Improve scalability
- Prevent duplicate code
- Make the project understandable
- Help AI place files correctly

This structure must not be modified without approval.

---

# 2. Root Directory

/
│
├── app/
├── components/
├── actions/
├── services/
├── lib/
├── hooks/
├── providers/
├── types/
├── constants/
├── config/
├── public/
├── styles/
├── messages/
├── docs/
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json

---

# 3. app/

Purpose

Application routes.

Contains

Public pages

Admin pages

Layouts

Error pages

Loading pages

Metadata

Example

app/

layout.tsx

page.tsx

about/

contact/

shop/

product/

category/

cart/

checkout/

wishlist/

account/

blog/

admin/

---

# 4. app/admin

Contains ONLY admin routes.

Example

admin/

layout.tsx

page.tsx

products/

orders/

customers/

collections/

reviews/

settings/

homepage/

analytics/

seo/

media/

Never place public pages here.

---

# 5. components/

Purpose

Reusable React components.

Never place business logic here.

Only UI.

---

# 6. components/ui

Generic reusable UI.

Examples

Button

Card

Input

Textarea

Badge

Avatar

Modal

Dialog

Drawer

Popover

Dropdown

Tabs

Accordion

Spinner

Skeleton

Pagination

Tooltip

Toast

---

# 7. components/layout

Layout components.

Navbar

Footer

Sidebar

Breadcrumb

Header

Mobile Menu

Search Bar

Language Switcher

---

# 8. components/home

Homepage-specific components.

Hero

Collections

Story

Newsletter

Testimonials

Featured Products

Shop By Room

Shop By Style

Instagram

---

# 9. components/product

Everything related to products.

Product Card

Gallery

Price

Description

Reviews

Specifications

Related Products

Product Actions

Wishlist Button

---

# 10. components/forms

Reusable forms.

Contact Form

Newsletter Form

Login Form

Checkout Form

Review Form

Product Form

Category Form

Collection Form

---

# 11. components/admin

Admin-only components.

Dashboard Cards

Sidebar

Data Tables

Charts

Forms

Image Upload

Product Editor

Rich Text Editor

Filters

Statistics

---

# 12. actions/

Purpose

Server Actions only.

Examples

createProduct

updateProduct

deleteProduct

login

logout

checkout

submitReview

subscribeNewsletter

Every file should perform ONE action.

---

# 13. services/

Purpose

Business logic.

Examples

Product Service

Order Service

Search Service

SEO Service

Blog Service

Email Service

Authentication Service

Services communicate with the database.

UI never communicates directly.

---

# 14. lib/

Purpose

Shared utilities.

Examples

Supabase Client

Validators

Date Utilities

Currency Formatter

Image Utilities

Slug Generator

Logger

---

# 15. hooks/

Purpose

Reusable React Hooks.

Examples

useCart

useWishlist

useLanguage

useTheme

useDebounce

usePagination

Hooks must never contain business logic.

---

# 16. providers/

Contains React Providers.

Examples

Theme Provider

Session Provider

Language Provider

Cart Provider

---

# 17. types/

Global TypeScript types.

Examples

Product

Category

Order

Customer

Review

Collection

Language

Never define duplicate interfaces.

---

# 18. constants/

Application constants.

Examples

Routes

Currencies

Languages

Navigation

Limits

SEO Defaults

Never hardcode constants elsewhere.

---

# 19. config/

Application configuration.

Examples

Site Config

Menu Config

Dashboard Config

SEO Config

Theme Config

---

# 20. public/

Static assets.

Folders

images/

icons/

logos/

fonts/

flags/

Never store uploaded products here.

Uploaded images belong in cloud storage.

---

# 21. styles/

Global styles only.

Examples

globals.css

animations.css

variables.css

No component-specific styles.

---

# 22. messages/

Translation files.

Example

en.json

it.json

Contains only translations.

No business logic.

---

# 23. docs/

Project documentation.

Contains

PRD

Architecture

Rules

Memory

Database

Folder Structure

Design

Phases

API

Deployment

---

# 24. Naming Convention

Folders

lowercase

Words separated with "-"

Examples

product-card

shopping-cart

Component Files

PascalCase

ProductCard.tsx

Navbar.tsx

Footer.tsx

Hooks

camelCase

useCart.ts

Types

PascalCase

Product.ts

Enums

PascalCase

OrderStatus.ts

---

# 25. File Ownership

Every file has ONE responsibility.

One component

One hook

One action

One service

One utility

Never combine unrelated logic.

---

# 26. Import Rules

Always import

Shared Components

↓

Feature Components

↓

Page Components

Never import pages into components.

Avoid circular dependencies.

---

# 27. Component Rules

Each component should

Have one responsibility

Receive typed props

Avoid unnecessary state

Be reusable

Remain small

Prefer composition over duplication.

---

# 28. Route Rules

Each page contains only

Metadata

Layout

Page Composition

Business logic belongs elsewhere.

---

# 29. Forbidden Locations

Never place

Database queries inside UI components

Business logic inside pages

Validation inside components

Large helper functions inside pages

Hardcoded data inside UI

---

# 30. AI Placement Rules

When creating

Button

↓

components/ui

Homepage Hero

↓

components/home

Product Card

↓

components/product

Database Query

↓

services

Server Action

↓

actions

Validation

↓

lib

Type

↓

types

Translation

↓

messages

Documentation

↓

docs

Never invent new folders.

---

# 31. Growth Strategy

The folder structure must comfortably support

10,000+ products

100+ components

20+ pages

Multiple languages

Future mobile applications

Additional admin features

Without restructuring.

---

# 32. Acceptance Criteria

Folder structure is correct when

✓ Every folder has one responsibility

✓ No duplicated components

✓ No misplaced business logic

✓ No undocumented folders

✓ Easy navigation

✓ Scalable

✓ AI always knows where new files belong

---

# 33. Final Statement

The folder structure is part of the architecture.

Every developer and every AI assistant must follow this organization exactly.

Consistency is more valuable than personal preference.

The structure should evolve only through documented architectural decisions.