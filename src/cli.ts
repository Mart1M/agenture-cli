#!/usr/bin/env node
import { relative, resolve } from 'node:path';
import { cwd, exit, stdout } from 'node:process';
import { getInitPlan, initWorkspace } from './init.js';
import { runDoctor } from './doctor.js';
import { S } from './style.js';

function printHelp(): void {
  stdout.write(`${S.bold('agenture')} ${S.dim('— memory, rules, agent playbook (skills via your AI)')}

${S.cyan('Usage:')}
  agenture init [directory] [options]
                  agenture doctor

${S.cyan('Commands:')}
  init    Copy ${S.bold('all')} bootstrap files ${S.dim('(.agents/, .memory/, root docs, Cursor / Claude / Copilot snippets)')} — no prompts; existing files are left unchanged unless ${S.green('--force')}.
  doctor  Check Node/npx and print skills pointers.

${S.cyan('Options:')}
  ${S.green('--force')}  Replace files that already exist instead of skipping them
  ${S.green('-h, --help')}

${S.cyan('Examples:')}
  agenture init
  agenture init ./app
  agenture init --force
`);
}

function toRel(targetRoot: string, abs: string): string {
  const rel = relative(targetRoot, abs);
  return rel && !rel.startsWith('..') ? rel : abs;
}

/** Short: details live in AGENT_SKILLS_INSTALL.md (printed after init). */
const AGENT_SKILLS_AUTO_INSTALL_PROMPT = `Read AGENT_SKILLS_INSTALL.md at the repository root and execute phase 2 as described there — run the actual shell commands from the project root (network allowed), not a summary. Use the correct npx skills --agent (or -a) for this session (e.g. codex, cursor, github-copilot, claude-code); ask once if unsure. End with npx skills list and tell me what to commit.`;

/** Where to continue after templates are on disk. */
function printPostInstallSetupHints(projectRoot: string): void {
  const fromCwd = relative(cwd(), projectRoot);
  const where =
    fromCwd && !fromCwd.startsWith('..') ? fromCwd : projectRoot;

  stdout.write(`\n${S.cyan('Next steps (outside this CLI)')}\n`);
  stdout.write(
    `  ${S.bold('Claude Code')} — Run ${S.green('/setup-agent-skills')} ` +
      `(or paste the prompt below; it also points at ${S.bold('AGENT_SKILLS_INSTALL.md')}).\n\n`,
  );
  stdout.write(
    `  ${S.bold('Codex, Cursor, Copilot, other agents')} — ${S.bold('Copy everything between the lines')} ` +
      `into your agent. It will read ${S.bold('AGENT_SKILLS_INSTALL.md')} and run ${S.dim('npx skills')} for you. ` +
      `Project: ${S.dim(where)}\n`,
  );
  const rule = `${S.dim('── copy prompt below ──')}\n`;
  stdout.write(`\n${rule}`);
  stdout.write(`${AGENT_SKILLS_AUTO_INSTALL_PROMPT}\n`);
  stdout.write(`${S.dim('── end of prompt ──')}\n`);
  stdout.write(
    `\n  ${S.dim('Rule files (not skills):')} .cursor/ ${S.dim('·')} .github/\n`,
  );
}

function printPlanSummary(
  targetRoot: string,
  toCreate: string[],
  existing: string[],
): void {
  stdout.write(`\n${S.bold(S.cyan('►'))} ${S.bold('Target:')} ${S.yellow(targetRoot)}\n\n`);
  if (toCreate.length > 0) {
    stdout.write(`${S.green('Will create')} (${toCreate.length}):\n`);
    const max = 12;
    for (const p of toCreate.slice(0, max)) {
      stdout.write(`  ${S.dim('·')} ${toRel(targetRoot, p)}\n`);
    }
    if (toCreate.length > max) {
      stdout.write(`  ${S.dim(`… and ${toCreate.length - max} more`)}\n`);
    }
    stdout.write('\n');
  }
  if (existing.length > 0) {
    stdout.write(
      `${S.yellow('Already exist')} (${existing.length}) ${S.dim('— pass --force to replace')}:\n`,
    );
    const max = 12;
    for (const p of existing.slice(0, max)) {
      stdout.write(`  ${S.dim('·')} ${toRel(targetRoot, p)}\n`);
    }
    if (existing.length > max) {
      stdout.write(`  ${S.dim(`… and ${existing.length - max} more`)}\n`);
    }
    stdout.write('\n');
  }
}

type ParsedInit = {
  target: string;
  force: boolean;
};

function parseInitArgv(argv: string[]): ParsedInit | null {
  const rest = argv.slice(2).filter((a) => a !== '');
  if (rest.length === 0 || rest[0] !== 'init') return null;

  const tail = rest.slice(1);
  const force = tail.includes('--force');
  const pos: string[] = [];

  for (let i = 0; i < tail.length; i++) {
    const t = tail[i];
    if (t === '--force') {
      continue;
    }
    pos.push(t);
  }

  const target = pos[0] ? resolve(pos[0]) : cwd();
  return { target, force };
}

function parseArgs(argv: string[]): {
  command: 'init' | 'doctor' | 'help';
  target: string;
  force: boolean;
} {
  const rest = argv.slice(2).filter((a) => a !== '');
  if (rest.length === 0 || rest[0] === '-h' || rest[0] === '--help') {
    return { command: 'help', target: cwd(), force: false };
  }
  const cmd = rest[0];
  if (cmd === '-h' || cmd === '--help') {
    return { command: 'help', target: cwd(), force: false };
  }
  if (cmd === 'doctor') {
    return { command: 'doctor', target: cwd(), force: false };
  }
  const initParsed = parseInitArgv(argv);
  if (!initParsed) {
    return { command: 'help', target: cwd(), force: false };
  }
  return { command: 'init', ...initParsed };
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  if (parsed.command === 'help') {
    printHelp();
    exit(0);
  }

  if (parsed.command === 'doctor') {
    const { ok, messages } = runDoctor();
    for (const line of messages) {
      if (line === '') stdout.write('\n');
      else if (line.startsWith('Skills:'))
        stdout.write(`${S.cyan(line)}\n`);
      else if (line.startsWith('Skills CLI'))
        stdout.write(`${S.dim(line)}\n`);
      else if (line.startsWith('npx:') || line.startsWith('Node:'))
        stdout.write(`${line}\n`);
      else stdout.write(`${line}\n`);
    }
    stdout.write('\n');
    exit(ok ? 0 : 1);
  }

  const { target, force } = parsed;

  stdout.write(
    `\n${S.dim('Install:')} ${S.bold('.agents/, .memory/, root stubs, .cursor/, .claude/, .github/')}\n`,
  );

  const plan = await getInitPlan(target);

  if (plan.toCreate.length === 0 && plan.existing.length === 0) {
    stdout.write(`${S.yellow('No template files to apply.')}\n`);
    exit(0);
  }

  if (plan.toCreate.length === 0 && plan.existing.length > 0 && !force) {
    printPlanSummary(target, plan.toCreate, plan.existing);
    stdout.write(
      `${S.yellow('All bootstrap files already exist.')} Use ${S.green('--force')} to replace them.\n`,
    );
    printPostInstallSetupHints(target);
    exit(0);
  }

  printPlanSummary(target, plan.toCreate, plan.existing);

  const overwriteExisting = force;
  if (plan.existing.length > 0 && !force) {
    stdout.write(
      `${S.dim('Skipping overwrite of existing files (pass --force to replace).')}\n`,
    );
  }

  const r = await initWorkspace(target, {
    overwriteExisting,
  });

  stdout.write(
    `\n${S.green('✓ Done')} — ${S.bold(String(r.written.length))} file(s) written`,
  );
  if (r.skipped.length > 0) {
    stdout.write(
      `, ${S.yellow(String(r.skipped.length))} ${S.dim('skipped (unchanged)')}`,
    );
  }
  stdout.write('\n');
  printPostInstallSetupHints(target);
  exit(0);
}

main().catch((err: unknown) => {
  console.error(S.red(err instanceof Error ? err.message : String(err)));
  exit(1);
});
