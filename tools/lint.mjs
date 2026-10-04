/**
 * The rules in REFACTOR_PLAN.md section 5, as code.
 *
 * Usage:
 *   node tools/lint.mjs
 *
 * Prints one line and exits 0 when every rule holds. Prints one line per
 * violation and exits 1 otherwise. No dependencies.
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Extensions worth reading. Everything else in assets is binary. */
const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.md']);

/** Shells join the browser file rules in the last stage of the refactor. */
const SHELLS = [];

const MAX_LINES = 200;

/** A file the browser loads, so the length and style rules apply to it. */
function isBrowserFile(file) {
  if (SHELLS.includes(file)) return true;
  const ext = extname(file);
  if (ext !== '.css' && ext !== '.js') return false;
  return file.startsWith('engine/') || file.startsWith('core/') || file.startsWith('customers/');
}

/** A deck file that declares slide content. */
function isContentFile(file) {
  return file.startsWith('core/content/') || file.startsWith('customers/content/');
}

/** A script written for this engine: engine or deck, never tools. */
function isDeckScript(file) {
  if (extname(file) !== '.js') return false;
  return file.startsWith('engine/js/') || file.startsWith('core/') || file.startsWith('customers/');
}

function lineCount(text) {
  return text.replace(/\n$/, '').split('\n').length;
}

const RULES = [
  {
    name: 'no em dash',
    applies: () => true,
    check: text => text.includes('\u2014') ? 'contains an em dash' : null
  },
  {
    name: 'at most 200 lines',
    applies: isBrowserFile,
    check: text => {
      const lines = lineCount(text);
      return lines > MAX_LINES ? `${lines} lines, limit ${MAX_LINES}` : null;
    }
  },
  {
    name: 'no web fonts',
    applies: isBrowserFile,
    check: text => /@font-face|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(text)
      ? 'declares or fetches a web font'
      : null
  }
  ,
  {
    name: 'no var',
    applies: isDeckScript,
    check: text => /\bvar\s/.test(text) ? 'declares a var' : null
  },
  {
    name: 'nothing at column zero',
    applies: file => file.startsWith('engine/js/'),
    check: text => /^(var|let|const|function)\s/m.test(text)
      ? 'declares something outside the wrapper'
      : null
  },
  {
    name: 'at most one top level const',
    applies: file => isDeckScript(file) && !file.startsWith('engine/js/'),
    check: text => {
      const tops = text.match(/^(var|let|const|function)\s/gm) || [];
      if (tops.length > 1) return `${tops.length} top level declarations, limit 1`;
      if (tops.some(top => !top.startsWith('const'))) return 'a top level declaration is not a const';
      return null;
    }
  }
  ,
  {
    name: 'no inline stagger index',
    applies: isContentFile,
    check: text => text.includes('--d:') ? 'declares --d inline' : null
  }
  // Later stages append their rules here.
];

async function walk(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(join(SITE_ROOT, dir), { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const child = dir === '.' ? entry.name : dir + '/' + entry.name;
    if (child === 'tools/baseline') continue;
    if (entry.isDirectory()) found.push(...(await walk(child)));
    else if (TEXT.has(extname(entry.name))) found.push(child);
  }
  return found;
}

const violations = [];

for (const file of (await walk('.')).sort()) {
  const text = await readFile(join(SITE_ROOT, file), 'utf8');
  for (const rule of RULES) {
    if (!rule.applies(file)) continue;
    const problem = rule.check(text, file);
    if (problem) violations.push(`${file}: ${rule.name}: ${problem}`);
  }
}

if (violations.length) {
  for (const line of violations) console.error(line);
  console.error(`\nlint: ${violations.length} violation(s)`);
  process.exit(1);
}

console.log('lint: every rule holds');
