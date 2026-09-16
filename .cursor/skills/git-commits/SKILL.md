---
name: git-commits
description: >-
  Formats Poison Rhythm git commits as TYPE: Title Case Message (ADD, FIX,
  UPDATE, REMOVE, REFACTOR, MERGE, REVERT, BRANCH, DEPLOY). Use when creating
  commits, writing commit messages, splitting changes into commits, or when the
  user invokes /git-commits.
---

# Git Commits

## Format

```
TYPE: Commit Message in Title Case
```

1. **Type** — one of the types below, uppercase
2. **Separator** — colon + space (`: `)
3. **Title Case** — capitalize the first letter of each word
4. **Descriptive** — say what the commit accomplishes; avoid vague text

Aim for ~50 characters or less on the subject line. Add a body after a blank line when detail helps.

## Types

| Type | When |
|------|------|
| `ADD` | New files, features, or functionality |
| `FIX` | Targeted bug fixes |
| `UPDATE` | Enhance or change existing behavior/docs/deps |
| `REMOVE` | Delete files, features, or functionality |
| `REFACTOR` | Restructure without changing behavior |
| `MERGE` | Merge one branch into another |
| `REVERT` | Roll back a previous commit |
| `BRANCH` | Feature/environment branch setup commits |
| `DEPLOY` | Deployment/build/config for shipping |

### Examples

**ADD**
- `ADD: New User Authentication Component`
- `ADD: Implement Dark Mode Toggle`
- `ADD: Add Unit Tests for Form Validation`

**FIX**
- `FIX: Resolve Memory Leak in Image Upload`
- `FIX: Correct Form Validation Logic`
- `FIX: Address TypeScript Compilation Errors`

**UPDATE**
- `UPDATE: Upgrade React to Version 18`
- `UPDATE: Modify User Interface Layout`
- `UPDATE: Enhance Error Handling Logic`

**REFACTOR**
- `REFACTOR: Reorganize Component File Structure`
- `REFACTOR: Extract Common Logic into Utility Functions`

**REMOVE**
- `REMOVE: Delete Unused Dependencies`
- `REMOVE: Remove Deprecated API Endpoints`

**MERGE** / **REVERT** / **BRANCH** / **DEPLOY**
- `MERGE: Feature Branch into Main`
- `REVERT: Rollback Feature That Caused Performance Issues`
- `BRANCH: Feature Branch for Payment Integration`
- `DEPLOY: Production Build Configuration`

### Good vs bad

**Good**
- `FIX: Resolve Authentication Token Expiration Issue`
- `ADD: Implement User Profile Image Upload Feature`
- `REFACTOR: Extract Form Validation Logic into Custom Hook`

**Bad**
- `fix bug` — missing type, not Title Case
- `ADD: stuff` — too vague
- `Update: Fixed the thing` — wrong type casing / mixed intent

### Multi-line

```
FIX: Resolve Memory Leak in Image Processing

- Implement proper cleanup in useEffect hooks
- Add error boundaries for image loading failures
- Update image cache management logic
```

## Branch names

Prefer:

- `feature/user-authentication`
- `fix/memory-leak-issue`
- `refactor/component-structure`
- `hotfix/critical-security-patch`

## Agent checklist

When the user asks for commits:

1. Inspect `git status`, `git diff`, and recent `git log` messages
2. Split unrelated changes into separate commits when practical
3. Stage only the files for that commit
4. Use `TYPE: Title Case Message` via HEREDOC; never amend unless the user explicitly asks and amend rules allow it
5. Do not push unless asked
