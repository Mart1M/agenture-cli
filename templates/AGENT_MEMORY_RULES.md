# Project memory (all agents)

Read this at the **start of each session** alongside `.memory/INDEX.md`.

**Bootstrap:** **[`.agents/`](./.agents/README.md)** (skills in `.agents/skills/` via `npx skills`; see [vercel-labs/skills](https://github.com/vercel-labs/skills)), plus **Cursor** `.cursor/rules/`, **GitHub Copilot** `.github/copilot-instructions.md`, **Claude Code** `.claude/commands/`. Delete any tool folder you do not use.

## Index

Read `.memory/INDEX.md` at the start of each session.

Detailed files are in `.memory/decision/`, `.memory/preference/`, `.memory/context/`, `.memory/pattern/`.

## Rule: update memory as you go

Whenever something important surfaces in the conversation — a technical decision, a stated preference, an established convention, a reusable pattern, something to avoid — **write it to `.memory/` immediately**, without waiting to be asked.

### Ordinary chat — no “memory” keyword

The user **will not** say “update memory”, “`.memory`”, or “enregistre en mémoire”. They ask for **normal work**: features, refactors, styling, tooling. **You still persist** whenever their message implies something **lasting** for the project (same session, same response flow when possible).

**Ask yourself:** *If a new teammate joined tomorrow, would this statement change how they should work?* If yes → **`.memory/`** + **`INDEX.md`**.

**Typical triggers** (any language):
- Stack / libs: “use Velocity here”, “on est full pnpm”, “App Router only”
- Convention: “from now on…”, “always…”, “never…”, “désormais…”, “pour cette app…”
- Correction: “non, plutôt X que Y”, “prefer hooks over classes for new code”
- Scope: “dans `apps/test` seulement”, “only under `packages/velocity`”

If you changed code to respect such a statement, the memory write is **mandatory**, not optional.

**Save when:**
- The user corrects your approach ("no, do it this way instead")
- A design or architecture decision is settled
- A convention is established for the first time
- A component or pattern is designated as the reference
- The user mandates a **library, design system, or stack** in chat (e.g. “use `@runswap/velocity` for UI”, “App Router only”) — **always** create a `.memory` entry in the same flow, even if you also update `AGENTS.md`

**Do not save:**
- Temporary debugging steps
- Unanswered questions
- Static text copied from `AGENTS.md` / `CLAUDE.md` / this file **when** there is no **new** fact or mandate from the current conversation (do not use this to skip saving a mandate the user *just* stated)

**Format** `.memory/{category}/YYYY-MM-DD-slug.md`:
```
---
date: YYYY-MM-DD
user: <identifier when known — e.g. session metadata, git profile, or what the user states; otherwise omit or leave empty>
category: decision | preference | context | pattern
tags: [tag1, tag2]
---

## Short title

Factual, actionable content (2–4 sentences max).
```

- **`date`**: calendar day when the decision or preference is recorded (authoritative: the session’s `Today's date` field when present).
- **`user`**: who stated or validated the fact being memorized; fill in whenever reliable information is available.
- When **updating** an existing entry, refresh `date` (or add `updated: YYYY-MM-DD`) and adjust `user` if the edit reflects a different person.

After every write, update `.memory/INDEX.md` (index lines may include a short date + user for quick scanning).
