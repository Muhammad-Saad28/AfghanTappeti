Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Project Rules

Priority: HIGHEST

Related Documents

- PRD.md
- Architecture.md
- Database.md
- Folder-Structure.md
- Phases.md
- Design.md
- Memory.md

---

# 1. Purpose

This document defines the mandatory rules every developer and every AI assistant must follow.

These rules override assumptions, preferences, and automatic decisions.

If there is any conflict between documentation, this file always has the highest priority.

---

# 2. Golden Rule

Never assume.

If something is not documented,
ASK.

Do not guess.

Do not invent.

---

# 3. Project Ownership

The project owner has the final decision.

AI is an implementation assistant.

AI is NOT the architect.

AI is NOT the designer.

AI is NOT the product owner.

---

# 4. Documentation Priority

Always read documentation in this order.

1.
Rules.md

2.
Memory.md

3.
Phases.md

4.
PRD.md

5.
Architecture.md

6.
Database.md

7.
Folder-Structure.md

8.
Design.md

Never skip this order.

---

# 5. Architecture Rules

Never

Change architecture

Change routing

Change project structure

Change technology stack

Change deployment strategy

Without approval.

---

# 6. Folder Rules

Never

Create random folders.

Rename folders.

Move files.

Delete folders.

Unless explicitly instructed.

---

# 7. File Rules

Never

Rename files

Delete files

Merge files

Split files

Without approval.

---

# 8. Dependency Rules

Never install

Packages

Libraries

Frameworks

Without approval.

Before suggesting a dependency explain

Why it is needed.

What problem it solves.

What alternatives exist.

---

# 9. Database Rules

Never

Create tables

Delete tables

Rename columns

Delete columns

Modify relationships

Without approval.

Database.md is the single source of truth.

---

# 10. UI Rules

Never redesign the UI.

Never change spacing.

Never change colors.

Never change typography.

Never change animations.

Without approval.

Follow Design.md exactly.

---

# 11. Component Rules

Every component

Must have one responsibility.

Must be reusable.

Must be typed.

Must remain small.

No duplicated components.

---

# 12. Business Logic Rules

Business logic never belongs inside

Pages

UI Components

Layouts

Business logic belongs inside

Services

Actions

---

# 13. Styling Rules

Use Tailwind CSS only.

No inline CSS.

No random CSS files.

Global styles only in styles/.

---

# 14. TypeScript Rules

Always

Strict typing.

No any.

No ts-ignore.

No unnecessary casting.

---

# 15. Code Quality Rules

Code must be

Readable

Reusable

Maintainable

Documented

Predictable

Simple

Avoid clever code.

Prefer readable code.

---

# 16. Naming Rules

Use meaningful names.

Never abbreviate.

Bad

prd

tmp

btn

Good

ProductCard

CreateProductAction

HomepageHero

---

# 17. Hardcoding Rules

Never hardcode

Products

Categories

Collections

Homepage

SEO

Prices

Images

Navigation

Languages

Content

Everything must be dynamic unless explicitly documented.

---

# 18. Translation Rules

Supported languages

English

Italian

No Google Translate.

No automatic translation.

Every visible string belongs in translation files.

---

# 19. API Rules

Never invent endpoints.

Never invent payloads.

Never invent response structures.

API must match documentation.

---

# 20. Security Rules

Never expose

Secrets

Keys

Environment variables

Database credentials

Never trust client input.

Always validate.

---

# 21. Authentication Rules

Never bypass authentication.

Never bypass authorization.

Never expose admin functionality publicly.

---

# 22. Performance Rules

Always

Optimize images.

Lazy load where appropriate.

Avoid unnecessary JavaScript.

Minimize client rendering.

---

# 23. Accessibility Rules

Every page must support

Keyboard navigation.

ARIA where appropriate.

Alt text.

Semantic HTML.

Proper heading hierarchy.

---

# 24. SEO Rules

Never remove

Metadata

Structured Data

Canonical URLs

Language alternates

Sitemap support

Robots configuration

SEO is mandatory.

---

# 25. Admin Rules

Every admin feature must

Validate input.

Show success/error feedback.

Prevent accidental deletion.

Be usable without coding knowledge.

---

# 26. Error Handling Rules

Never expose internal errors.

Always provide user-friendly messages.

Log technical details separately.

---

# 27. Logging Rules

Log

Unexpected errors.

Authentication failures.

Database failures.

Server failures.

Do not log sensitive information.

---

# 28. Git Rules

Never

Rewrite history.

Delete branches.

Force push.

Without explicit approval.

Commit messages must be meaningful.

---

# 29. AI Behavior Rules

AI must

Read documentation first.

Follow the current phase.

Never skip requirements.

Never implement future phases.

Never invent features.

Never optimize prematurely.

Never refactor unrelated code.

Never perform hidden changes.

Always explain proposed changes before implementation.

Always keep changes as small as possible.

---

# 30. Phase Rules

Only work on the current phase.

Never start another phase.

Never partially implement future functionality.

Complete one phase before moving forward.

---

# 31. Memory Rules

After completing any task

Update Memory.md.

Record

Completed work

Pending work

Known issues

Architectural decisions

Open questions

Memory.md is always current.

---

# 32. Communication Rules

If requirements are unclear

Ask.

If documentation conflicts

Stop.

Ask.

If architecture changes

Ask.

If database changes

Ask.

Never assume.

---

# 33. Forbidden Actions

The AI must NEVER

Invent requirements.

Invent UI.

Invent APIs.

Invent database tables.

Invent folder structures.

Invent dependencies.

Invent routes.

Invent authentication.

Invent translations.

Invent SEO.

Invent product data.

Invent admin functionality.

Modify architecture.

Modify documentation without permission.

Delete working code.

Replace libraries because of preference.

Perform large refactors without approval.

---

# 34. Required Actions

Before every implementation

Read documentation.

Check Memory.md.

Check current Phase.

Verify Architecture.

Verify Database.

Verify Folder Structure.

Implement only requested work.

After implementation

Update Memory.md.

---

# 35. Definition of Done

A task is complete only when

Requirements satisfied.

No TypeScript errors.

No lint errors.

No console errors.

Responsive.

Accessible.

Matches design.

Matches documentation.

Memory updated.

Phase updated if applicable.

---

# 36. Escalation Rules

Stop and ask for approval if

Architecture changes.

Database changes.

New dependency required.

Folder structure changes.

Authentication changes.

Large refactor.

Security implications.

Payment flow.

Deployment changes.

---

# 37. Non-Negotiable Rules

These rules may NEVER be violated.

No assumptions.

No undocumented features.

No architecture changes.

No database changes.

No hidden behavior.

No unnecessary dependencies.

No random refactoring.

No duplicated code.

No hardcoded business data.

Documentation always wins.

---

# 38. Final Statement

The purpose of these rules is to ensure Afghan Tappeti remains consistent, scalable, maintainable, and predictable.

Every developer and every AI assistant must treat this document as the project's constitution.

If unsure, stop and ask.

Never guess.