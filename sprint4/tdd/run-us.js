// Runs the unit tests (test.js) and shows only the tests for ONE user story.
// Usage (from the sprint4 folder):  node tdd/run-us.js US11
import { execFileSync } from 'node:child_process';

const us = (process.argv[2] || '').toUpperCase();
if (!/^US\d+$/.test(us)) { console.log('Usage: node tdd/run-us.js US11'); process.exit(1); }

// run every test, but keep the output instead of printing it
let out;
try { out = execFileSync(process.execPath, ['test.js'], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } }); }
catch (e) { out = e.stdout || ''; }

let inSection = false, pass = 0, fail = 0;
for (const line of out.split('\n')) {
    const head = /^=== (US\d+)\b/.exec(line);
    if (line.startsWith('===')) { inSection = !!head && head[1] === us; if (inSection) console.log('\x1b[1;34m' + line + '\x1b[0m'); continue; }
    if (!inSection) continue;
    const t = line.trim();
    if (t.startsWith('PASS')) { pass++; console.log('  \x1b[1;32mPASS\x1b[0m' + t.slice(4)); }
    else if (t.startsWith('FAIL')) { fail++; console.log('  \x1b[1;31mFAIL\x1b[0m' + t.slice(4)); }
}
if (pass + fail === 0) { console.log(`No tests found for ${us}`); process.exit(1); }
console.log(`\x1b[1;${fail ? 31 : 32}m${us} result: ${pass} passed, ${fail} failed\x1b[0m`);
process.exit(fail ? 1 : 0);
