# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install        # install dependencies
pnpm run build      # compile TypeScript to dist/
pnpm dev init /tmp/test-bootstrap  # run CLI in dev mode (no build needed)
node dist/cli.js init /path/to/project  # run compiled CLI
```

There are no tests. TypeScript compilation (`pnpm run build`) is the primary correctness check.

To disable ANSI colors during manual testing: `NO_COLOR=1 pnpm dev init /tmp/test`

## Architecture

This is a zero-dependency Node.js CLI (ESM, TypeScript) that copies a fixed set of template files into a target project directory.

**Source layout (`src/`):**
- `cli.ts` — entry point; parses argv, renders plan/output, calls `init` or `doctor`
- `init.ts` — `getInitPlan()` (dry-run diff) and `initWorkspace()` (file copy); both walk `templates/` and map paths to the target directory
- `doctor.ts` — checks Node/npx availability and prints skills pointers
- `paths.ts` — resolves `templatesDir()` relative to the compiled `dist/` directory (one level up from `here`)
- `style.ts` — ANSI color helpers; disabled when `NO_COLOR` is set or stdout is not a TTY

**Template system:** Everything under `templates/` is copied verbatim to the target directory preserving relative paths. The `templates/` directory is distributed in the npm package alongside `dist/`. `paths.ts` resolves it as `../templates` relative to the compiled output.

**Key behaviors:**
- `init` defaults to `cwd()` if no directory argument is given
- Existing files are skipped by default; `--force` overwrites them
- `getInitPlan()` is a pure dry-run that classifies destinations into `toCreate` / `existing` before any writes happen
- After `init`, the CLI prints a prompt string for agents to run `npx skills` via `AGENT_SKILLS_INSTALL.md`

**What gets installed into target projects:**
- `.agents/skills/` — landing zone for `npx skills add`
- `.memory/` — structured memory directories (`decision/`, `preference/`, `pattern/`, `context/`)
- Root stubs: `CLAUDE.md`, `AGENTS.md`, `AGENT_MEMORY_RULES.md`, `AGENT_SKILLS_INSTALL.md`
- Agent-specific rule files: `.cursor/rules/agent-memory.mdc`, `.claude/commands/setup-agent-skills.md`, `.github/copilot-instructions.md`
