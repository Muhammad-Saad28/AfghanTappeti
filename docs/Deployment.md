Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Deployment

Related Documents

- Architecture.md
- Database.md
- Workflow.md
- Memory.md

---

# 1. Purpose

This document defines the official deployment strategy for Afghan Tappeti.

It explains how the application moves from development to production and how production infrastructure should be configured and maintained.

This document must be updated whenever deployment architecture changes.

---

# 2. Deployment Architecture

Frontend

Next.js

↓

Vercel

↓

Users

Backend

Next.js Route Handlers

Next.js Server Actions

↓

Supabase

↓

PostgreSQL

↓

Storage

Domain

AfghanTappeti.com

DNS

Managed by Domain Provider

SSL

Automatically managed by Vercel

---

# 3. Production Stack

Frontend

Next.js

Hosting

Vercel

Database

Supabase PostgreSQL

Authentication

Supabase Auth

Storage

Supabase Storage

Email

Future

Resend

Analytics

Future

Google Analytics

Search Console

Google Search Console

Monitoring

Vercel Analytics

Future

Sentry

---

# 4. Environment Variables

Development

.env.local

Production

Configured inside Vercel.

Never commit environment variables.

Required Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_SITE_URL

---

# 5. Deployment Process

Developer

↓

Git Commit

↓

GitHub

↓

Vercel Build

↓

Production Deployment

↓

Health Check

↓

Live Website

Deployments should only occur from the main branch.

---

# 6. Branch Strategy

main

Production

develop

Development

feature/*

Individual features

bugfix/*

Bug fixes

hotfix/*

Critical production fixes

Never deploy feature branches directly to production.

---

# 7. Build Checklist

Before deployment verify

✓ Project builds successfully

✓ No TypeScript errors

✓ No ESLint errors

✓ No console errors

✓ Environment variables configured

✓ Images optimized

✓ Database migrations complete

✓ Documentation updated

---

# 8. Database Deployment

Database changes must be applied using Supabase migrations.

Never modify production tables manually unless required for emergency recovery.

Every schema change must be documented.

---

# 9. Storage

Product images

Stored in Supabase Storage.

Database stores only file paths.

Never store uploaded files inside the repository.

---

# 10. Domain Configuration

Production

https://AfghanTappeti.com

Preferred

https://www.AfghanTappeti.com

Redirect all traffic to the preferred domain.

HTTPS required.

---

# 11. SSL

SSL certificates managed automatically.

HTTPS must always be enforced.

Never allow HTTP access.

---

# 12. Backup Strategy

Database

Daily automated backups

Storage

Regular exports

Documentation

Stored in Git

Repository

GitHub

---

# 13. Monitoring

Monitor

Application uptime

Database status

Storage usage

Authentication

Build failures

Deployment logs

Performance

---

# 14. Error Reporting

Production errors should be logged.

Future integration

Sentry

Critical issues should be investigated immediately.

---

# 15. Security

Never expose

Service Role Key

Secrets

Environment variables

Database credentials

Enable Row Level Security.

Use HTTPS only.

---

# 16. Performance Targets

Homepage

<2 seconds

Product Page

<2 seconds

Largest Contentful Paint

<2.5 seconds

Lighthouse

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

---

# 17. SEO Deployment Checklist

Verify

Sitemap

robots.txt

Metadata

Canonical URLs

Structured Data

Language alternates

Open Graph

Twitter Cards

---

# 18. Release Checklist

Before every production release

✓ Documentation updated

✓ Memory.md updated

✓ CHANGELOG.md updated

✓ Tests completed

✓ Build successful

✓ Responsive verified

✓ Accessibility verified

✓ SEO verified

✓ Approval received

---

# 19. Rollback Strategy

If deployment fails

Rollback immediately to the previous stable deployment.

Verify

Database

Authentication

Images

Orders

Products

After rollback

Investigate

Fix

Redeploy

---

# 20. Disaster Recovery

Repository

GitHub

Database

Supabase Backups

Storage

Supabase Storage

Documentation

Git Repository

Recovery priority

1. Database

2. Authentication

3. Storage

4. Frontend

---

# 21. Maintenance

Regularly

Update dependencies

Review logs

Review backups

Review security

Optimize performance

Review SEO

---

# 22. Future Infrastructure

Cloudflare CDN

Redis Cache

Image CDN

Sentry Monitoring

Email Queue

Background Jobs

Advanced Analytics

These enhancements may be added without changing the core architecture.

---

# 23. Acceptance Criteria

Deployment strategy is complete when

✓ Production environment configured

✓ HTTPS enabled

✓ Database connected

✓ Storage operational

✓ Environment variables secured

✓ Automatic deployments working

✓ Backup strategy documented

✓ Rollback process defined

---

# 24. Final Statement

Afghan Tappeti must always be deployable through a documented, repeatable, secure, and reliable process.

Production stability takes priority over deployment speed.

Every deployment should be traceable, reversible, and fully documented.