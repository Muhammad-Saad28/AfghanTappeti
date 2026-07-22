Project: Afghan Tappeti

Version: 1.1

Status: Approved

Last Updated: 2026-07-22

# Memory

YYYY-MM-DD

Related Documents

- Rules.md
- Workflow.md
- Phases.md

---

# Purpose

Memory.md is the project's living memory.

It records the current state of development, completed work, pending work, important decisions, and known issues.

This document must be updated after every completed task or development session.

---

# Current Project Status

Project Stage

Active Development

Current Phase

Phase 11 – Internationalization (Completed)

Overall Progress

78%

Current Sprint

Image Organization & Deployment Prep

---

# Current Objective

Build a premium bilingual (English & Italian) luxury e-commerce platform for authentic hand-knotted Oriental and Persian rugs with a complete admin dashboard powered by Supabase.

Current priority:

✅ i18n (Phase 11) — English + Italian translations completed.

---

# Completed Documentation

Status

✅ AI_CONTEXT.md

✅ PRD.md

✅ Architecture.md

✅ Database.md

✅ Folder-Structure.md

✅ Rules.md

✅ Workflow.md

✅ Coding-Standards.md

✅ Features.md

✅ Design.md

✅ Phases.md

---

# Pending Documentation

Status

⬜ Deployment.md

⬜ CHANGELOG.md

---

# Completed Development

✅ Phase 1-10: All foundational, design, public pages, product catalog, admin dashboard, product CRUD, content management, ecommerce features
✅ Next.js 16.2.10 + Tailwind v4 + shadcn/ui + framer-motion
✅ Supabase: 21 tables, RLS, indexes, seed data
✅ Auth: Login, middleware, protected admin routes
✅ Public: Homepage, About, Contact, Shop, Product Detail, Collections, Blog, Wishlist
✅ Admin: Dashboard, Products CRUD, Blog CRUD, Reviews, Newsletter, Categories, Collections, Orders, Customers, Analytics, SEO, Settings, Media placeholder
✅ Ecommerce: Cart (localStorage + hook), Checkout, Orders, Customers, Address migration
✅ Images: 86 images renamed to SKU-NN.jpg, organized into public/images/products/{SKU}/ subfolders (local backup), WebP versions generated via sharp (q80)
✅ Netlify: netlify.toml created
✅ i18n (Phase 11): All public pages translated EN/IT — server components use getDictionary, client components use direct JSON import pattern. Pages: home, shop, about, contact, blog, blog/[slug], collections, styles, rooms, product/[slug], cart, checkout, checkout/success, wishlist, + AddToCartButton, Navbar, Footer

---

# Current Technology Stack

Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

Framer Motion

Backend

Next.js Server Actions

Next.js Route Handlers

Database

Supabase PostgreSQL

Authentication

Supabase Auth

Storage

Supabase Storage

Deployment

Netlify

Package Manager

npm

---

# Current Folder Structure

Status

Approved

No changes allowed without approval.

---

# Current Database Status

Status

Implemented

21 tables active in Supabase (profiles, products, product_images, categories, product_categories, collections, product_collections, origins, materials, sizes, shapes, colors, customers, orders, order_items, reviews, blogs, homepage_sections, newsletter_subscribers, seo_metadata, site_settings)

Ecommerce migration: added shipping_address, billing_address (JSONB), customer_email, customer_phone to orders; public insert policies

---

# Current Design Status

Status

Approved

Luxury branding

Responsive

English

Italian

Inspired by

Nain Trading

Sherzada

---

# Current Features Status

Planning Complete

Implementation Pending

---

# Architectural Decisions

Decision 001

Next.js App Router

Status

Approved

Decision 002

Supabase Backend

Status

Approved

Decision 003

Server Components by default

Status

Approved

Decision 004

Tailwind CSS

Status

Approved

Decision 005

Framer Motion

Status

Approved

Decision 006

English + Italian only

Status

Approved

Decision 007

Dynamic content managed from Admin Panel

Status

Approved

Decision 008

No hardcoded business content

Status

Approved

---

# Known Issues

None

---

# Open Questions

None

---

# Next Task

✅ Phase 11: Internationalization (EN/IT — all public pages translated, language switcher functional, SEO alternate languages)
Phase 12: Polish, Filters, Admin Dashboard enhancements

---

# Future Features

AI Search

AR Room Preview

Bulk Product Import

Coupons

Gift Cards

Trade Accounts

Designer Accounts

Inventory Management

Advanced Analytics

---

# Important Business Notes

Website Name

Afghan Tappeti

Domain

AfghanTappeti.com

Brand Position

Luxury

Premium

Authentic

Hand-knotted Oriental & Persian Rugs

Languages

English

Italian

Admin Users

Initially one administrator.

Architecture supports multiple administrators in the future.

---

# Rules Reminder

Never change architecture without approval.

Never modify database without approval.

Never install packages without approval.

Never implement future phases.

Never hardcode business data.

Always update this document after every completed task.

---

# Session Log

Session 001

Completed

Project documentation planning.

Session 002

Completed

Architecture documentation.

Session 003

Completed

Database documentation.

Session 004

Completed

Folder structure documentation.

Session 005

Completed

Rules documentation.

Session 006

Completed

Workflow documentation.

Session 007

Completed

Coding standards documentation.

Session 008

Completed

Features documentation.

Session 009

Completed

Design documentation.

Session 010

Completed

Development roadmap (Phases.md).

Session 011

Completed

Phase 1: Next.js project init, Tailwind v4 config, shadcn/ui setup, fonts, folder structure.

Session 012

Completed

Phase 2: Supabase project, 21 tables, RLS, indexes, seed data, client/server/admin utils.

Session 013

Completed

Phase 3: Login page, server actions, middleware, admin layout with sidebar + header.

Session 014

Completed

Phase 4: Design system — Label, Textarea, Select, Checkbox, Dialog, Table, Container, Section, animation variants.

Session 015

Completed

Phase 5: Public pages — Homepage, About, Contact, Shop, Product Detail, Collections, Blog.

Session 016

Completed

Phase 6: Product Catalog — wishlist (localStorage + useSyncExternalStore).

Session 017

Completed

Phase 7-8: Admin dashboard layout, product CRUD (create/edit/delete/restore), admin profile.

Session 018

Completed

Phase 9: Blog CRUD, Reviews management, Newsletter list, Homepage sections editor, Media placeholder.

Session 019

Completed

Phase 10: Cart (lib/cart.ts + useCart hook), cart page, checkout page, order confirmation, admin orders (list + detail), admin customers, Add to Cart on product detail. Ecommerce migration for order addresses.

Session 020

Completed

Remaining admin pages — categories, collections, analytics, SEO, settings. Docs updated to reflect phases 1-10 complete.

---

# Change History

Version 1.0

Initial project memory created.

---

# Final Statement

Memory.md is the single source of truth for the current project state.

Every development session must begin by reading this document and end by updating it.

No task is considered complete until Memory.md reflects the latest state of the project.