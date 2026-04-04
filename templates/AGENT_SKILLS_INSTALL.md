# Install agent skills (phase 2) — any agent

## What phase 1 (`init`) does **not** do

**`agenture-cli init` only copies templates** (`.agents/`, `.memory/`, root docs, tool snippets). It does **not** run `npx skills`, call skills.sh, or infer your frameworks. There is no automatic “install skills from tech stack” step in the CLI.

**Phase 2** is when someone (you or a coding agent **with repo access**) reads the stack, searches [skills.sh](https://skills.sh) / `npx skills find`, and runs **`npx skills add … -a <agent>`** for the tools you actually use.

## Universal prompt (also printed at end of `init`)

After **`agenture-cli init`**, the CLI prints a **short copy-paste prompt** that tells your AI to open **this file** and run phase 2 for real (the detailed steps are below in **Procedure**, not in the prompt). If you lost the terminal output, paste this instead: *Read `AGENT_SKILLS_INSTALL.md` at the repo root and execute phase 2 as written — real `npx skills` commands from the project root; use the right `-a` for your agent (`codex`, `cursor`, `github-copilot`, `claude-code`); ask once if unsure; finish with `npx skills list` and what to commit.*

## What this repo gives you

Bootstrap adds **`.agents/`** (including **`.agents/skills/`** for agents that use that path), plus **Copilot** → `.github/copilot-instructions.md`, **Cursor** → `.cursor/rules/`, **Claude Code** → `.claude/commands/setup-agenture.md` (slash command playbook). Use repo context to pick skills from the public directory.

## Links

- [https://skills.sh/](https://skills.sh/)
- CLI documentation: [https://skills.sh/docs](https://skills.sh/docs)
- Implementation / flags: [https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)

## Procedure

1. Read **`package.json`**, workspace configs, and obvious stack files so keywords for search are accurate.

2. Run discovery in the project root (requires network):

   ```bash
   npx skills find
   ```

   Or non-interactive keyword search:

   ```bash
   npx skills find <keyword>
   ```

3. List skills in a bundle when needed:

   ```bash
   npx skills add owner/repo --list
   ```

4. Install only what fits the repo and the agents the team uses. Example:

   ```bash
   npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -y
   ```

   Replace `owner/repo`, skill names, and `--agent` values per [vercel-labs/skills](https://github.com/vercel-labs/skills).

5. Optional: disable CLI telemetry for the team:

   ```bash
   export DISABLE_TELEMETRY=1
   ```

   (or `DO_NOT_TRACK=1` — see skills CLI README.)

6. Verify: `npx skills list` and check install paths for each agent you targeted (see [vercel-labs/skills](https://github.com/vercel-labs/skills) — e.g. `.claude/skills`, `.agents/skills`).

7. Tell the user what was installed and what to commit.

**Claude Code:** Type **`/setup-agenture`** to load the project command (`.claude/commands/setup-agenture.md`).

## OpenAI Codex CLI

Codex does **not** use `.claude/commands/`. Use the same **`npx skills`** CLI with **`--agent codex`** (or **`-a codex`**):

```bash
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a codex -y
```

For **project scope** (default), skills land in **`.agents/skills/`** — the folder this bootstrap already creates. **Global** installs use `~/.codex/skills/` (see the *Supported Agents* table in [vercel-labs/skills](https://github.com/vercel-labs/skills)).

Official Codex skills docs: [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills).

**Codex:** use **`--agent codex`** (or **`-a codex`**) on every `npx skills add`. The **universal prompt** from `init` already tells the model to pick the right `-a` value; you can add *“use `-a codex`”* in your first message if needed.

**Cursor / GitHub Copilot:** rules under **`.cursor/`** and **`.github/copilot-instructions.md`**; install skills with **`npx skills add … -a cursor`** or **`-a github-copilot`** (often **`.agents/skills/`** in the repo).
