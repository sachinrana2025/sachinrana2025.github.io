// Fails the build if private addressing, credentials or personal contact data reach
// source, public assets or the exported site. Run after `next build`.
// `--repo` scans every git-tracked file instead (run it before each push: the repo
// is public on GitHub Pages).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOTS = ['src', 'public', 'out'];
const TEXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.html', '.txt', '.svg', '.css', '.xml', '.md']);
const PATTERNS = [
  ['private IPv4 (10/8)', /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/],
  ['private IPv4 (192.168/16)', /\b192\.168\.\d{1,3}\.\d{1,3}\b/],
  ['private IPv4 (172.16/12)', /\b172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/],
  ['basic-auth credential', /-u\s+\w+:\S+|\b\w+:\w+@[\w.-]+\.\w+/],
  ['bearer token', /Bearer\s+[A-Za-z0-9._-]{8,}/],
  ['access PIN', /\bPIN\s*[:#]?\s*\d{4,}/],
  ['internal site/host ids', /\b(?:idx-?\d{3,}|VM-\d{3}|CT\s?\d{3})\b/i],
  ['internal dev hosts', /\b[\w-]+\.(dev|internal)\.ideaxa\.io\b/],
  ['personal email', /@(gmail|yahoo|hotmail|outlook|live)\.com\b/i],
  ['phone number', /\+1\s*\(\d{3}\)\s*\d{3}-\d{4}|\+91[\s-]?\d{5}[\s-]?\d{5}/],
  ['github token', /\bgh[pousr]_[A-Za-z0-9]{20,}/],
  ['llm api key', /\bsk-(ant-)?[A-Za-z0-9_-]{20,}/],
  ['aws access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

// The one contact address the owner chose to publish. Any other personal address
// still fails the check.
const PUBLIC_CONTACT = 'sachin.rana@live.com';

const hits = [];
const SELF = 'scripts/check-leaks.mjs';

function scanFile(p) {
  if (p === SELF) return;
  const lines = readFileSync(p, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const scanned = line.split(PUBLIC_CONTACT).join('');
    for (const [label, re] of PATTERNS) {
      const m = scanned.match(re);
      if (m) hits.push(`${p}:${i + 1}  ${label}  «${m[0]}»`);
    }
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (TEXT.has(extname(p))) scanFile(p);
  }
}

const repoMode = process.argv.includes('--repo');
let scope;
if (repoMode) {
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
  const binary = /\.(png|webp|jpe?g|gif|ico|pdf|woff2?)$/i;
  files.filter((f) => !binary.test(f) && existsSync(f)).forEach(scanFile);
  scope = `${files.length} tracked files`;
} else {
  for (const root of ROOTS) if (existsSync(root)) walk(root);
  scope = ROOTS.filter(existsSync).join(', ');
}

if (hits.length) {
  console.error(`check-leaks: ${hits.length} finding(s)\n` + hits.join('\n'));
  process.exit(1);
}
console.log(`check-leaks: clean (${scope})`);
