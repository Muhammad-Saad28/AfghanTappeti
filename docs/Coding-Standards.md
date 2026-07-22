Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Coding Standards

Priority: HIGH

Related Documents

- Rules.md
- Architecture.md
- Folder-Structure.md
- Workflow.md

---

# 1. Purpose

This document defines the official coding standards for Afghan Tappeti.

Every developer and AI assistant must follow these standards.

The goals are:

- Consistency
- Readability
- Maintainability
- Scalability
- Predictability

---

# 2. General Principles

Code should be:

- Simple
- Readable
- Maintainable
- Reusable
- Predictable

Never write clever code if simple code achieves the same result.

Readable code is preferred over shorter code.

---

# 3. TypeScript

Always use TypeScript.

Rules

✔ Strict mode enabled

✔ Strong typing

✔ Explicit return types where appropriate

✔ Use interfaces for object contracts

✔ Use enums only when necessary

Never

❌ Use any

❌ Use ts-ignore

❌ Disable TypeScript checks

---

# 4. React Components

Each component should have one responsibility.

Good

Navbar

Hero

ProductCard

ReviewCard

Bad

Component that manages products, reviews and authentication together.

Maximum recommended component size

300 lines

Split large components.

---

# 5. Server vs Client Components

Default

Server Components

Use Client Components only when required.

Examples

Client

Forms

Animations

Dropdowns

Cart interactions

Search input

Server

Homepage

Product pages

Blog pages

Collections

Category pages

SEO pages

---

# 6. File Size

Recommended limits

Components

300 lines

Hooks

200 lines

Services

300 lines

Actions

150 lines

Pages

200 lines

Large files should be split logically.

---

# 7. Function Size

Recommended

10–40 lines

Maximum

80 lines

Large functions should be decomposed.

---

# 8. Naming Conventions

Components

PascalCase

ProductCard.tsx

Navbar.tsx

Functions

camelCase

createProduct()

updateOrder()

Variables

camelCase

productPrice

selectedColor

Constants

UPPER_SNAKE_CASE

MAX_UPLOAD_SIZE

Routes

kebab-case

/product-details

---

# 9. Imports

Import order

1. React

2. Next.js

3. Third-party libraries

4. Internal aliases

5. Relative imports

Example

import React from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import "./styles.css"

---

# 10. Comments

Write comments only when necessary.

Good

Explain WHY.

Bad

Explain WHAT.

Avoid obvious comments.

---

# 11. JSDoc

Public utilities

Shared functions

Complex business logic

Should include JSDoc.

Simple UI components do not require JSDoc.

---

# 12. Error Handling

Never ignore errors.

Always

Validate

Catch

Return meaningful messages

Never expose stack traces.

---

# 13. Async Code

Always

Use async/await

Never

Chain multiple .then()

Avoid callback nesting.

---

# 14. Validation

Validate

Forms

Server Actions

API inputs

Database inputs

Never trust client input.

---

# 15. Business Logic

Business logic belongs only in

Services

Actions

Never

Pages

Components

Layouts

---

# 16. State Management

Prefer

Server state

Local component state

Context only when necessary

Avoid unnecessary global state.

---

# 17. Styling

Use Tailwind CSS.

Never

Inline styles

Random CSS files

Global utility classes

Use design tokens where possible.

---

# 18. Accessibility

Every interactive element must

Have keyboard support

Have ARIA labels where appropriate

Have sufficient contrast

Use semantic HTML

---

# 19. Performance

Optimize

Images

Rendering

Re-renders

Bundle size

Avoid unnecessary client-side JavaScript.

---

# 20. Security

Never expose

Secrets

Tokens

Environment variables

Always sanitize user input.

---

# 21. Logging

Log

Unexpected errors

Critical events

Never log

Passwords

Tokens

Sensitive customer data

---

# 22. Testing Mindset

Before considering code complete

Ask

Does it work?

Does it break existing features?

Does it follow documentation?

Would another developer understand it?

---

# 23. Refactoring

Refactor only when

Improves readability

Improves maintainability

Removes duplication

Never refactor for personal preference.

---

# 24. Documentation

Every significant architectural decision

Must be documented.

Keep

Memory.md

Architecture.md

Database.md

Updated.

---

# 25. Code Review Checklist

Before marking complete

✓ TypeScript passes

✓ No lint errors

✓ No console errors

✓ Responsive

✓ Accessible

✓ Documentation updated

✓ Matches design

✓ Matches architecture

✓ No duplicated code

✓ No unnecessary dependencies

---

# 26. Final Statement

The purpose of these standards is to ensure that every line of code in Afghan Tappeti is consistent, maintainable, and scalable.

Quality is determined not only by functionality but also by clarity, simplicity, and adherence to the project's documented standards.