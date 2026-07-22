Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Architecture Document

Related Documents:
- PRD.md
- Rules.md
- Phases.md
- Design.md
- Memory.md

---

# 1. Purpose

This document defines the complete technical architecture of Afghan Tappeti.

It explains HOW the project is built.

It does NOT define business requirements.
Business requirements belong in PRD.md.

Any architectural modification requires explicit approval from the project owner.

---

# 2. High-Level Architecture

                        Internet
                            │
                            ▼
                  Next.js Frontend
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
   Server Actions      API Routes       Middleware
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
                       Supabase
      ┌──────────────┬───────────────┬──────────────┐
      │              │               │              │
 PostgreSQL      Authentication     Storage      Realtime
      │
      ▼
Business Data

---

# 3. Technology Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion

Backend

- Next.js Route Handlers
- Next.js Server Actions

Database

- PostgreSQL (Supabase)

Authentication

- Supabase Authentication

Storage

- Supabase Storage

Deployment

- Vercel

Version Control

- GitHub

Package Manager

- npm

---

# 4. Architecture Principles

The system shall follow these principles.

1.
Server First

Use Server Components whenever possible.

---

2.
Minimal Client Components

Client Components only when browser interaction is required.

---

3.
Database Driven

Nothing important is hardcoded.

Content comes from the database.

---

4.
Reusable Components

Every UI element should be reusable.

---

5.
Scalable

Architecture must support future expansion.

---

6.
Strong Typing

TypeScript everywhere.

No "any".

---

7.
Separation of Concerns

UI

Business Logic

Database

Authentication

must remain separate.

---

# 5. Project Structure

/app

Public routes

/admin

Admin dashboard

/components

Reusable UI

/components/ui

Generic components

/components/layout

Navigation

Footer

Sidebar

/components/forms

Reusable forms

/lib

Utilities

/helpers

Shared helper functions

/services

Business services

/actions

Server Actions

/hooks

Custom React Hooks

/types

Global TypeScript types

/constants

Application constants

/public

Images

Fonts

Icons

/styles

Global styles

/messages

Translation files

---

# 6. Routing Strategy

Public

/

Shop

/shop

Collections

/collections

Product

/product/[slug]

Category

/category/[slug]

Blog

/blog

Contact

/contact

About

/about

Wishlist

/wishlist

Cart

/cart

Checkout

/checkout

Account

/account

---

Admin

/admin

/admin/products

/admin/orders

/admin/categories

/admin/reviews

/admin/media

/admin/settings

/admin/homepage

/admin/seo

---

# 7. Authentication Architecture

Public users

No login required.

Customers

Optional account.

Admin

Authentication required.

Unauthorized users cannot access any admin page.

Authentication is session-based.

---

# 8. Authorization

Only administrators can

Create Products

Delete Products

Modify Prices

Upload Images

Manage Orders

Manage Homepage

Manage SEO

Manage Reviews

Manage Settings

---

# 9. Database Architecture

All application data shall be stored in PostgreSQL.

No important business data shall exist as hardcoded files.

The database is the single source of truth.

---

# 10. Storage Architecture

Images

Product Images

Hero Images

Blog Images

Category Images

Stored in cloud storage.

Database stores references only.

Images are never stored directly inside database records.

---

# 11. Data Flow

Visitor

↓

Page Request

↓

Next.js

↓

Server Component

↓

Server Action

↓

Database

↓

Response

↓

Rendered HTML

---

Admin Flow

Login

↓

Authentication

↓

Dashboard

↓

CRUD Operation

↓

Validation

↓

Database Update

↓

Success Response

---

# 12. Component Architecture

Components shall be divided into

Layout Components

Business Components

UI Components

Feature Components

Form Components

Shared Components

No duplicated components.

---

# 13. State Management

Server data

Fetched from database.

Local UI state

React state.

Global state

Only if absolutely necessary.

Avoid unnecessary client state.

---

# 14. Image Strategy

All product images shall be optimized.

Responsive sizes.

Lazy loading.

Modern image formats.

High quality.

Fast delivery.

---

# 15. Internationalization

Supported Languages

English

Italian

Every route exists in both languages.

URLs

/en

/it

Translations are manually managed.

No automatic translation.

---

# 16. Search Architecture

Search shall support

Product Name

SKU

Origin

Material

Collection

Search must remain scalable.

---

# 17. Filtering Architecture

Filtering shall support

Price

Size

Color

Material

Collection

Origin

Shape

Multiple filters simultaneously.

---

# 18. Product Architecture

Each product supports

Multiple Images

Multiple Categories

Multiple Collections

SEO

Reviews

Stock

Pricing

Status

Featured

Best Seller

Slug

---

# 19. Homepage Architecture

Homepage sections are dynamic.

Hero

Collections

Story

Testimonials

Newsletter

Nothing is hardcoded.

---

# 20. Blog Architecture

Blog supports

Categories

Featured Images

SEO

Rich Text

Draft

Publish

---

# 21. SEO Architecture

Every page supports

Title

Description

Canonical

Open Graph

Twitter Card

Structured Data

Sitemap

Robots

Language Alternates

---

# 22. Performance Architecture

Server rendering first.

Static generation whenever possible.

Caching where appropriate.

Optimized images.

Minimal JavaScript.

---

# 23. Security Architecture

HTTPS only.

Secure authentication.

Server-side validation.

Input sanitization.

Rate limiting where appropriate.

Environment variables never exposed.

Secrets never committed.

---

# 24. Logging

Application errors

Server errors

Authentication failures

Database failures

must be logged.

---

# 25. Error Handling

User-friendly messages.

No internal errors exposed.

Graceful fallback pages.

404

500

Unauthorized

Forbidden

---

# 26. Monitoring

Track

Performance

Errors

Traffic

Orders

User behavior

Search terms

---

# 27. Scalability

Architecture must support

10,000+ products

100,000+ visitors

Multiple collections

Multiple administrators

Future integrations

without major redesign.

---

# 28. Future Integrations

Payment gateways

Shipping providers

Email platform

Analytics

CRM

Inventory

ERP

Architecture shall remain modular.

---

# 29. Coding Standards

TypeScript

Strict typing

Small reusable components

Readable naming

Consistent formatting

Self-documenting code

---

# 30. Folder Ownership

Each folder has one responsibility.

No mixed concerns.

Business logic never belongs inside UI components.

Database queries never belong inside presentation components.

---

# 31. Dependencies

Only necessary dependencies may be installed.

Unused packages shall be removed.

Large libraries require approval.

---

# 32. Build Strategy

Development

↓

Testing

↓

Production Build

↓

Deployment

↓

Monitoring

---

# 33. Deployment Pipeline

Developer

↓

GitHub

↓

Production Build

↓

Deployment

↓

Health Check

↓

Live Website

---

# 34. Backup Strategy

Database backups.

Storage backups.

Configuration backups.

Documentation backups.

Regular automated backups preferred.

---

# 35. Disaster Recovery

If deployment fails

Rollback.

If database fails

Restore backup.

If storage fails

Restore media.

Downtime should be minimized.

---

# 36. Architectural Constraints

The following shall not change without approval.

Project structure

Routing strategy

Authentication strategy

Database structure

Technology stack

Folder organization

Language strategy

Deployment strategy

---

# 37. Acceptance Criteria

Architecture is complete when

✓ Public website works

✓ Admin dashboard works

✓ Authentication works

✓ Dynamic products work

✓ Dynamic homepage works

✓ Multi-language works

✓ SEO works

✓ Performance targets met

✓ Secure authentication implemented

✓ Database is source of truth

✓ Storage separated from database

✓ Codebase remains modular

---

# 38. Final Statement

The architecture of Afghan Tappeti is designed to support a premium, scalable, maintainable, and secure e-commerce platform.

Every architectural decision prioritizes scalability, maintainability, performance, developer experience, and long-term business growth.

No implementation should violate the architectural principles defined in this document.