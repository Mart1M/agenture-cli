import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** Compiled `dist/` → package root (contains `templates/`). */
export function packageRoot(): string {
  return join(here, '..');
}

export function templatesDir(): string {
  return join(packageRoot(), 'templates');
}
