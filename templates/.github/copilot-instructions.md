# GitHub Copilot — repository custom instructions

Bootstrap file from **agenture-cli**.

**VS Code + Copilot (no Cursor):** You do **not** get `.cursor/rules/*.mdc` — those are **Cursor-only**. Copilot loads **this file** (`.github/copilot-instructions.md`) as repo instructions, plus the root docs **[`AGENT_MEMORY_RULES.md`](../AGENT_MEMORY_RULES.md)** and **[`AGENTS.md`](../AGENTS.md)**. That is your equivalent of “project rules”: keep them in sync when the team updates policies (Cursor users often edit `.cursor/rules/` **and** `AGENT_MEMORY_RULES.md` — Copilot teammates follow the root files + this one).

**Portable layer:** [`.agents/README.md`](../.agents/README.md) — skills install under `.agents/skills/` for many tools via `npx skills`.

**Canonical memory rules (all tools):** [AGENT_MEMORY_RULES.md](../AGENT_MEMORY_RULES.md) at repo root — keep that file and this one aligned when you edit policies.

## Session start

1. Read [`.memory/INDEX.md`](../.memory/INDEX.md).
2. Follow the same memory discipline as `AGENT_MEMORY_RULES.md` (write to `.memory/{category}/YYYY-MM-DD-slug.md` with frontmatter, update the index).

## Silent memory — infer from normal requests

The user **does not** have to mention memory, `.memory`, or “save this”. Treat **any lasting project signal** in everyday chat as requiring a file write:

- They ask for a change that implies a **rule** (“only Tailwind”, “Velocity for UI”, “strict TS”, “French copy”, “pnpm only”) → create **`.memory/decision/`** or **`preference/`** + update **[`INDEX.md`](../.memory/INDEX.md)** in the **same turn** as your code/help.
- They only state a policy **without** asking for code → still write `.memory/` (do not answer with chat alone).

Use the frontmatter format in **`AGENT_MEMORY_RULES.md`**. Use **agent / edit** mode so files on disk actually change.

Optional: also update **`AGENTS.md`**; it does **not** replace `.memory/`.

## Skills (skills.sh)

Use full repo context, then follow **[`AGENT_SKILLS_INSTALL.md`](../AGENT_SKILLS_INSTALL.md)** at the repo root: `npx skills find`, `npx skills add`, target `--agent github-copilot` when installing bundles (see [vercel-labs/skills](https://github.com/vercel-labs/skills)).

Optional: disable skills CLI telemetry with `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`.

## Project & conventions

Fill in **[`AGENTS.md`](../AGENTS.md)** for stack and team rules — treat it as the human-facing source of truth alongside `CLAUDE.md` if present.
