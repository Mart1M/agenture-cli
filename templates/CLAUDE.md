# Claude Code / project context

> Adjust this file for your team. **Portable hub:** [`.agents/README.md`](./.agents/README.md). **Memory rules:** [`AGENT_MEMORY_RULES.md`](./AGENT_MEMORY_RULES.md).

## Project

_Describe the product, scope, and stack here._

## Conventions

_Add team rules (languages, testing, styling)._

## Project memory

Follow **[`AGENT_MEMORY_RULES.md`](./AGENT_MEMORY_RULES.md)** and read `.memory/INDEX.md` at the start of each session.

Category folders: `.memory/decision/`, `.memory/preference/`, `.memory/context/`, `.memory/pattern/`.

### Rule: update memory as you go

Write important decisions, preferences, conventions, patterns, and things to avoid to `.memory/` as soon as they appear. Use `.memory/{category}/YYYY-MM-DD-slug.md` with frontmatter (`date`, `user` when known, `category`, `tags`). Update `.memory/INDEX.md` after each write.

Do not duplicate what is already in `AGENTS.md` or `AGENT_MEMORY_RULES.md`.

## Phase 2: Agent skills

Run the **slash command** **`/setup-agenture`** (`.claude/commands/setup-agenture.md`). Alternatively read **`AGENT_SKILLS_INSTALL.md`**.

Use full repo context to run `npx skills find` / `npx skills add` against [skills.sh](https://skills.sh/).
