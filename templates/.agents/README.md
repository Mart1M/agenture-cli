# `.agents/` — portable agent layer

**Tool-agnostic directory** for shared skills and docs. **agenture-cli** also adds tool-specific folders at the repo root (`.cursor/`, `.claude/`, `.github/…`).

**Not for Claude slash commands:** Claude Code only picks up **`/…` commands** from **`.claude/commands/`**, not from `.agents/commands/`. Keep playbooks like `setup-agent-skills` under `.claude/commands/` if you want a slash command.

## `skills/`

Many tools install **agent skills** here when you run the official CLI (see [skills.sh](https://skills.sh/) and [vercel-labs/skills](https://github.com/vercel-labs/skills)). That includes **OpenAI Codex** (`npx skills add owner/repo -a codex`) and **GitHub Copilot**, **Cursor**, etc. — see the “Supported Agents” table in the skills README. Commit this folder if the team should share the same skills.

## Where to read first

1. **[`AGENT_MEMORY_RULES.md`](../AGENT_MEMORY_RULES.md)** at repo root — memory discipline (all agents).
2. **[`.memory/INDEX.md`](../.memory/INDEX.md)** — session index.

## Skills playbook

Follow **[`AGENT_SKILLS_INSTALL.md`](../AGENT_SKILLS_INSTALL.md)** for discovery and install commands with full repo context.
