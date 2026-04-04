import { spawnSync } from 'node:child_process';

export function runDoctor(): { ok: boolean; messages: string[] } {
  const messages: string[] = [];
  let ok = true;

  const node = process.version;
  messages.push(`Node: ${node}`);

  const npx = spawnSync('npx', ['--version'], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (npx.status !== 0) {
    ok = false;
    messages.push('npx: not available — install Node.js with npm.');
  } else {
    messages.push(`npx: ${npx.stdout?.trim() ?? 'ok'}`);
  }

  messages.push('');
  messages.push(
    'Skills: `.agents/skills/` (npx skills). Claude → /setup-agenture; Copilot → .github/copilot-instructions.md + AGENT_SKILLS_INSTALL.md.',
  );
  messages.push('Skills CLI: https://skills.sh/docs · https://github.com/vercel-labs/skills');

  return { ok, messages };
}
