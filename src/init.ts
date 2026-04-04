import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { templatesDir } from './paths.js';

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walkFiles(full)));
    } else if (e.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function loadTemplateIndex(): Promise<{
  root: string;
  files: string[];
}> {
  const templateRoot = templatesDir();
  try {
    await stat(templateRoot);
  } catch {
    throw new Error(
      `Templates directory missing: ${templateRoot}. Run "pnpm build" from the package root before using the CLI, or install from npm.`,
    );
  }
  const files = await walkFiles(templateRoot);
  return { root: templateRoot, files };
}

export type InitPlan = {
  /** Absolute paths — destination does not exist yet */
  toCreate: string[];
  /** Absolute paths — destination already exists */
  existing: string[];
};

export type InitResult = {
  written: string[];
  skipped: string[];
};

/** Dry-run: classify template destinations without writing. */
export async function getInitPlan(targetRoot: string): Promise<InitPlan> {
  const { root: templateRoot, files: allFiles } = await loadTemplateIndex();
  const toCreate: string[] = [];
  const existing: string[] = [];

  for (const abs of allFiles) {
    const rel = relative(templateRoot, abs);
    const dest = join(targetRoot, rel);
    try {
      await stat(dest);
      existing.push(dest);
    } catch {
      toCreate.push(dest);
    }
  }

  return { toCreate, existing };
}

export type InitWorkspaceOptions = {
  overwriteExisting: boolean;
};

/**
 * Copy every file under templates/. Existing destinations are skipped unless
 * `overwriteExisting` is true (then they are replaced).
 */
export async function initWorkspace(
  targetRoot: string,
  options: InitWorkspaceOptions,
): Promise<InitResult> {
  const { root: templateRoot, files: allFiles } = await loadTemplateIndex();
  const written: string[] = [];
  const skipped: string[] = [];

  for (const abs of allFiles) {
    const rel = relative(templateRoot, abs);
    const dest = join(targetRoot, rel);

    let exists = false;
    try {
      await stat(dest);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !options.overwriteExisting) {
      skipped.push(dest);
      continue;
    }

    const buf = await readFile(abs);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    written.push(dest);
  }

  return { written, skipped };
}
