# Agent instructions

> For humans and coding agents. **Hub:** [`.agents/README.md`](./.agents/README.md). **Shared memory:** [`AGENT_MEMORY_RULES.md`](./AGENT_MEMORY_RULES.md). Bootstrap also adds **Cursor** `.cursor/rules/`, **GitHub Copilot** `.github/copilot-instructions.md`, **Claude** [`CLAUDE.md`](./CLAUDE.md) + `.claude/commands/` — remove what you do not need.

## Project

_Describe the product, scope, and stack here._

## Conventions

_Add team rules (languages, testing, styling, security)._

## Project memory

Follow **[`AGENT_MEMORY_RULES.md`](./AGENT_MEMORY_RULES.md)** and read `.memory/INDEX.md` at the start of each session.

Detailed files live in `.memory/decision/`, `.memory/preference/`, `.memory/context/`, `.memory/pattern/`.

### Rule: update memory as you go

Whenever something important surfaces — a decision, preference, convention, reusable pattern, or anti-pattern — **write it to `.memory/` immediately**.

Do **not** duplicate content already in `CLAUDE.md`, this file, or `AGENT_MEMORY_RULES.md`.

**Format:** `.memory/{category}/YYYY-MM-DD-slug.md` with frontmatter (`date`, `user` when known, `category`, `tags`). Keep entries short (2–4 sentences). Update `.memory/INDEX.md` after each write.

## Phase 2: Agent skills

Install skills from [skills.sh](https://skills.sh/) using one of:

- **Claude Code:** Slash command **`/setup-agent-skills`** (`.claude/commands/setup-agent-skills.md`)
- **Any agent:** **`AGENT_SKILLS_INSTALL.md`** at the repo root

The agent should use full repo context and `npx skills find` / `npx skills add` as documented there.
