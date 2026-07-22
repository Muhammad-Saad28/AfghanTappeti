Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Changelog

This project follows semantic versioning.

Version Format

MAJOR.MINOR.PATCH

Example

1.0.0

Major

Breaking changes

Minor

New features

Patch

Bug fixes

---

# [Unreleased]

## Planned

- Multi-language support (EN/IT)
- SEO optimization (sitemap, robots, structured data)
- Performance optimization
- Testing
- Deployment to Netlify

---

# [1.1.0] - 2026-07-21

Status

Implementation Complete (Phases 1-10)

## Added

### Infrastructure
- Next.js 16.2.10 with App Router
- Tailwind CSS v4 with design tokens (stichdesign palette)
- Playfair Display + Inter fonts
- Framer Motion animations
- shadcn/ui (Button, Card, Input, Badge, Label, Textarea, Select, Checkbox, Dialog, Table)
- Full folder structure per Folder-Structure.md
- Path aliases configured

### Backend
- Supabase project with 21 database tables
- RLS policies, indexes, seed data
- Server component client (`lib/supabase/server.ts`)
- Client-side client (`lib/supabase/client.ts`)
- Admin client (`lib/supabase/admin.ts`)
- Middleware client (`lib/supabase/middleware.ts`)

### Authentication
- Login page (`/login`)
- Server actions (login, signup, signout)
- Middleware protecting `/admin/*`
- Admin layout with sidebar + header
- User profile page

### Public Website
- Homepage (hero, search, collections, shop by style/room/color/size, best sellers, features, story, reviews, instagram, newsletter)
- About page (heritage, hand-knotting, ethical sourcing)
- Contact page (form + details)
- Shop page (product grid, filters, sort, pagination)
- Collections page (6 collection cards)
- Product Detail page (gallery, specs, accordions, real DB data)
- Blog listing + dynamic blog posts

### Product Catalog
- Wishlist (localStorage + useSyncExternalStore)
- Wishlist page (`/wishlist`)
- Navbar live wishlist count

### Admin Dashboard
- Dashboard/analytics (revenue, orders, products, customers stats)
- Products CRUD (list, create, edit, soft delete, restore)
- Categories CRUD (list, create, delete)
- Collections CRUD (list, create, delete)
- Blog CRUD (list, create, edit, delete, draft/published/archived)
- Reviews management (approve, reject, delete)
- Newsletter subscriber list
- Homepage sections toggle
- Orders list + detail with status/payment management
- Customers list
- SEO metadata editor
- Site settings editor
- Profile page
- Media library placeholder

### Ecommerce
- Cart utility (`lib/cart.ts`) with localStorage persistence and useSyncExternalStore
- Cart page (update qty, remove, order summary)
- Add to Cart button on product detail
- Checkout page (customer info, shipping, billing, order summary)
- Order confirmation page
- Order address fields migration (JSONB)

## Changed

- All 21 DB tables implemented in Supabase
- Documentation phased progress updated

---

# [1.0.0] - Initial Project Planning

Date

YYYY-MM-DD

Status

Planning Complete

---

## Added

### Documentation

- AI_CONTEXT.md
- PRD.md
- Architecture.md
- Database.md
- Folder-Structure.md
- Rules.md
- Workflow.md
- Coding-Standards.md
- Features.md
- Design.md
- Phases.md
- Memory.md
- Deployment.md
- CHANGELOG.md

### Project Definition

- Complete business requirements
- Technical architecture
- Database schema
- Folder organization
- Coding standards
- Development workflow
- Feature specifications
- Design system
- Development roadmap
- Deployment strategy

### Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

Backend

- Next.js Server Actions
- Route Handlers

Infrastructure

- Supabase
- PostgreSQL
- Supabase Storage
- Supabase Authentication

Deployment

- Vercel

Languages

- English
- Italian

---

## Changed

Initial project documentation established.

---

## Fixed

None

---

## Removed

None

---

## Security

Security rules established.

Authentication strategy defined.

Deployment strategy documented.

---

## Known Issues

None.

---

## Next Release

Target Version

1.1.0

Expected Features

- Internationalization (EN/IT)
- Language switcher
- Translation files

---

# Release Template

Copy the following template for every new release.

---

# [X.Y.Z] - YYYY-MM-DD

## Added

-

-

-

## Changed

-

-

-

## Fixed

-

-

-

## Removed

-

-

-

## Security

-

-

-

## Performance

-

-

-

## Documentation

-

-

-

## Known Issues

-

-

-

---

# Semantic Versioning Rules

Major Version

Breaking changes

Architecture changes

Database redesign

Framework migration

Minor Version

New features

New pages

New modules

New functionality

Patch Version

Bug fixes

Performance improvements

Documentation updates

Minor UI fixes

Security fixes

## v2.1.0 (2026-07-22) — Image Organization & Netlify Setup

### Added
- 86 product images renamed from WhatsApp filenames to `SKU-NN.jpg` convention
- Images organized into `public/images/products/{SKU}/` subfolders (local backup)
- WebP versions generated for all 86 images (sharp, quality 80)
- `netlify.toml` created for Netlify deployment
- Images 42/43/44 assigned to AK-030 and PF-010 products

### Changed
- Deployment target updated from Vercel to Netlify across all docs
- Memory.md, Phases.md, Deployment.md updated for Netlify

---

## v2.0.0 (2026-07-21) — Phase 14: Testing & Cleanup

### Lint & TypeScript Cleanup
- Fixed 32 ESLint errors (no-explicit-any, no-html-link-for-pages, no-require-imports)
- Fixed 26 ESLint warnings (unused imports, unused variables)
- Replaced `<a>` tags with `<Link>` on homepage
- Removed unused `Container`/`Section`/`Link` imports across multiple pages
- Defined proper `Address`/`OrderItem` interfaces for admin order detail
- Cleaned up unused variables in customers, orders, products pages
- Removed unused `getSnapshot`/`subscribe` in cart.ts, `publicPaths` in i18n-middleware.ts
- Fixed duplicate variable declaration in about/page.tsx

### Build Verification
- Build passes (`npm run build`) — clean compile + typecheck
- Lint passes (`npm run lint`) — 0 warnings, 0 errors

---

# Release Process

Before every release verify

✓ Documentation updated

✓ Memory.md updated

✓ Current phase completed

✓ Build successful

✓ TypeScript clean

✓ Lint clean

✓ Responsive

✓ Accessibility verified

✓ SEO verified

✓ Production tested

---

# Version History

| Version | Status | Description |
|----------|--------|-------------|
| 2.1.0 | Current | Image organization, WebP, Netlify setup |
| 2.0.0 | Complete | Phase 14 testing, lint/TS cleanup |
| 1.1.0 | Complete | Phases 1-10 implementation |
| 1.0.0 | Planning | Initial project planning and documentation |

---

# Final Statement

The changelog is the official history of Afghan Tappeti.

Every feature, improvement, bug fix, security update, architectural decision, and release must be recorded here.

No production change should exist without a corresponding changelog entry.