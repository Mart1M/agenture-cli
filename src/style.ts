import { stdout } from 'node:process';

const color =
  stdout.isTTY && process.env.NO_COLOR == null && process.env.FORCE_COLOR !== '0';

const esc = (open: string, s: string) =>
  color ? `\x1b[${open}m${s}\x1b[0m` : s;

export const S = {
  bold: (s: string) => esc('1', s),
  dim: (s: string) => esc('2', s),
  green: (s: string) => esc('32', s),
  yellow: (s: string) => esc('33', s),
  red: (s: string) => esc('31', s),
  cyan: (s: string) => esc('36', s),
  magenta: (s: string) => esc('35', s),
};
