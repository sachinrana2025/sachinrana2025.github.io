// Publish the static export to the gh-pages branch, which GitHub Pages serves.
// Used while GitHub Actions is unavailable on the account; when Actions works again,
// .github/workflows/pages.yml can take over (switch the Pages source back to Actions).
//
//   npm run deploy:pages
//
// Builds (which runs the leak check), scans every tracked file, then force-pushes a
// single commit of out/ to origin's gh-pages branch.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });
const read = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();

if (read('git', ['status', '--porcelain'])) {
  console.error('deploy-pages: commit or stash your changes first, so the published site matches a commit.');
  process.exit(1);
}

run('npm', ['run', 'build']);
run('npm', ['run', 'check:repo']);
if (!existsSync('out/.nojekyll')) {
  console.error('deploy-pages: out/.nojekyll is missing; Pages would hide _next/.');
  process.exit(1);
}

const remote = read('git', ['remote', 'get-url', 'origin']);
const rev = read('git', ['rev-parse', '--short', 'HEAD']);
const dir = mkdtempSync(join(tmpdir(), 'gh-pages-'));
try {
  cpSync('out', dir, { recursive: true });
  run('git', ['init', '-q', '-b', 'gh-pages'], { cwd: dir });
  run('git', ['add', '-A'], { cwd: dir });
  run('git', ['commit', '-q', '-m', `Publish site build from ${rev}`], { cwd: dir });
  run('git', ['push', '-f', remote, 'gh-pages'], { cwd: dir });
  console.log(`deploy-pages: published ${rev} to gh-pages`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
