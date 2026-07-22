Project: Afghan Tappeti

Version: 1.0

Status: Approved

Last Updated: YYYY-MM-DD

# Workflow Document

Priority: HIGH

Related Documents

- Rules.md
- PRD.md
- Architecture.md
- Database.md
- Folder-Structure.md
- Phases.md
- Memory.md

---

# 1. Purpose

This document defines the official workflow for developing Afghan Tappeti.

Every developer and every AI assistant must follow this workflow.

The purpose is to ensure

- Consistency
- Predictability
- Documentation
- Quality
- No accidental changes

---

# 2. Workflow Philosophy

The project follows a strict development cycle.

Think

Plan

↓

Review

↓

Approve

↓

Implement

↓

Verify

↓

Document

↓

Complete

Never skip a step.

---

# 3. Standard Development Flow

Every task follows exactly this sequence.

STEP 1

Read documentation

↓

STEP 2

Understand task

↓

STEP 3

Analyze impact

↓

STEP 4

Propose solution

↓

STEP 5

Wait for approval

↓

STEP 6

Implement

↓

STEP 7

Self review

↓

STEP 8

Test

↓

STEP 9

Update documentation

↓

STEP 10

Mark complete

---

# 4. Before Starting Any Task

Always perform the following.

Read

Rules.md

Memory.md

Current Phase

Relevant documentation

Confirm

Current objective

Dependencies

Impact

If anything is unclear

STOP

Ask.

---

# 5. Proposal Phase

Before coding

AI must explain

What will change

Which files

Why

Potential risks

Expected result

No code changes before approval.

---

# 6. Implementation Phase

Implementation must be

Small

Incremental

Focused

Predictable

One feature at a time.

Never implement multiple unrelated features.

---

# 7. Review Phase

After implementation

Verify

Requirements

Architecture

Database

Performance

Accessibility

SEO

No undocumented behavior.

---

# 8. Testing Phase

Every feature must be checked.

Visual

Functional

Responsive

TypeScript

Lint

Runtime

Edge cases

If any issue exists

Fix before completion.

---

# 9. Documentation Phase

Every completed task updates

Memory.md

If architecture changed

Architecture.md

If database changed

Database.md

If phase completed

Phases.md

Documentation is mandatory.

---

# 10. Task States

Every task has one state.

Planned

↓

Approved

↓

In Progress

↓

Testing

↓

Completed

↓

Archived

No task may skip states.

---

# 11. Phase Workflow

Each phase follows

Planning

↓

Approval

↓

Implementation

↓

Testing

↓

Review

↓

Completion

↓

Next Phase

Never begin the next phase until the current one is complete.

---

# 12. Bug Workflow

Bug Found

↓

Reproduce

↓

Analyze

↓

Identify Cause

↓

Fix

↓

Retest

↓

Update Memory

↓

Close

Never patch symptoms.

Fix root cause.

---

# 13. Feature Workflow

Requirement

↓

Analysis

↓

Approval

↓

Implementation

↓

Testing

↓

Documentation

↓

Complete

---

# 14. Refactoring Workflow

Refactoring requires approval.

Reason

↓

Proposal

↓

Approval

↓

Implementation

↓

Regression Test

↓

Documentation

↓

Complete

Never refactor because of personal preference.

---

# 15. Documentation Workflow

Every document has an owner.

PRD

Business

Architecture

System

Database

Schema

Design

UI

Rules

Behavior

Memory

Progress

Keep documentation synchronized.

---

# 16. Code Review Checklist

Before completion verify

✓ Matches PRD

✓ Matches Design

✓ Matches Architecture

✓ Matches Database

✓ Matches Rules

✓ Matches Folder Structure

✓ No duplicated code

✓ No hardcoded data

✓ No unnecessary dependencies

✓ Strong typing

✓ Responsive

✓ Accessible

✓ SEO preserved

---

# 17. AI Self Review

Before finishing

AI must ask

Did I change architecture?

Did I create undocumented behavior?

Did I invent anything?

Did I modify unrelated files?

Did I break existing functionality?

If yes

Stop

Explain.

---

# 18. Completion Checklist

Task is complete only if

Requirements met

Code reviewed

Responsive

Accessible

Performance acceptable

TypeScript clean

Lint clean

No runtime errors

Memory updated

Phase updated

---

# 19. Emergency Rules

Immediately stop if

Architecture conflict

Database conflict

Security concern

Authentication issue

Deployment issue

Missing documentation

Conflicting requirements

Ask before proceeding.

---

# 20. Change Management

Every change must be

Intentional

Documented

Reviewed

Approved

Traceable

No hidden modifications.

---

# 21. File Modification Policy

Modify only files related to the task.

Do not format unrelated files.

Do not reorganize unrelated folders.

Do not rename unrelated variables.

Keep changes isolated.

---

# 22. Feature Freeze Policy

Once a phase is complete

No new features may be added to that phase.

New requests belong to future phases.

---

# 23. Rollback Policy

If implementation introduces instability

Rollback immediately.

Preserve working functionality.

Document the rollback.

---

# 24. Definition of Ready

A task is ready when

Requirements exist

Documentation exists

Dependencies identified

Approval received

Current phase active

---

# 25. Definition of Done

A task is done when

Requirements implemented

Tests passed

Documentation updated

Memory updated

Approved

No known issues

---

# 26. AI Conduct

AI must

Be predictable

Be transparent

Explain decisions

Avoid assumptions

Ask when uncertain

Respect documentation

Never prioritize convenience over correctness.

---

# 27. Final Statement

Workflow exists to protect the quality and long-term maintainability of Afghan Tappeti.

Every feature, bug fix, refactor, and improvement must follow this workflow.

Skipping workflow is considered a project violation.