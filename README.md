# agenture-cli

![agenture-cli](./agenture-cli.png)

Bootstrap your repo with a shared memory system, agent rules, and skill install playbooks — compatible with Claude Code, GitHub Copilot, Cursor, and OpenAI Codex.

## What it does

**Phase 1 — `init`:** copies a fixed set of files into your project (no prompts, no network):

| What | Where |
|---|---|
| Shared memory system | `.memory/` + `AGENT_MEMORY_RULES.md` |
| Agent hub | `.agents/` (skills land here for most tools) |
| Universal agent instructions | `AGENTS.md` |
| Skills install playbook | `AGENT_SKILLS_INSTALL.md` |
| Claude Code | `CLAUDE.md` + `.claude/commands/setup-agenture.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/agent-memory.mdc` |

**Phase 2 — skills:** your agent reads the repo, searches [skills.sh](https://skills.sh/), and installs the skills that match your stack via `npx skills`.

## Requirements

- Node.js 20+

## Usage

### On any existing project

```bash
cd /path/to/your/project
npx agenture-cli@latest init
```

Existing files are left untouched. Use `--force` to replace them:

```bash
npx agenture-cli@latest init --force
```

### From a clone of this repo

```bash
pnpm install
pnpm run build
node dist/cli.js init /path/to/your/project
```

### Check your environment

```bash
npx agenture-cli@latest doctor
```

Prints your Node/npx versions and skills CLI pointers.

## Phase 2: install skills

After `init`, the CLI prints a prompt to paste into your agent. It will:

1. Scan your stack (`package.json`, lockfiles, frameworks, etc.)
2. Search [skills.sh](https://skills.sh/) with `npx skills find`
3. Install the relevant skills with `npx skills add … -a <agent>`

**Claude Code** — run the slash command:
```
/setup-agenture
```

**Copilot / Cursor / Codex / other agents** — paste the prompt printed by `init`, or tell your agent:
> Read `AGENT_SKILLS_INSTALL.md` at the repo root and execute phase 2 — real `npx skills` commands, use the right `-a` for your agent (`github-copilot`, `cursor`, `codex`…).

Skills are installed into `.agents/skills/` (project-scoped) by default. Commit that folder to share them with your team.

## Memory system

Every agent that reads the bootstrapped files follows the same memory discipline defined in `AGENT_MEMORY_RULES.md`:

- Decisions, preferences, conventions, and patterns go into `.memory/{category}/YYYY-MM-DD-slug.md`
- The agent updates `.memory/INDEX.md` after each write
- No keyword needed — any lasting project signal triggers a write automatically

Categories: `decision/`, `preference/`, `context/`, `pattern/`

## Telemetry

The skills CLI (`npx skills`) collects usage telemetry by default. Opt out:

```bash
export DISABLE_TELEMETRY=1
# or
export DO_NOT_TRACK=1
```

## License

MIT
