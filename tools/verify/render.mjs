/* Runs the page's DATA + template layer under Node with a stub document,
   and prints the HTML each mount() would write. Lets the migration be
   verified end to end without a browser. */
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';

const file = process.argv[2];
const outJson = process.argv[3];
const src = readFileSync(file, 'utf8');

// 1. the DATA block, shared by every page
const dataSrc = readFileSync(join(dirname(file), 'static/js/data.js'), 'utf8');
const dataMatch = dataSrc.match(/@@DATA@@[\s\S]*?\*\/\s*(const DATA = \{[\s\S]*?\n\};)/);
if (!dataMatch) throw new Error('DATA block not found');

// 2. the shared templates, then the page's own layout script
const tplShared = readFileSync(join(dirname(file), 'static/js/tpl.js'), 'utf8');
const pageMatch = src.match(/<script>\s*(\/\* =+\s*\n\s*@@PAGE@@[\s\S]*?)<\/script>/);
if (!pageMatch) throw new Error('@@PAGE@@ script not found');
const tpl = tplShared + '\n' + pageMatch[1];

const mounted = {};
const warnings = [];
const sandbox = {
  console: { warn: (...a) => warnings.push(a.join(' ')), log: () => {} },
  location: { hash: '' },
  document: {
    querySelector(sel) {
      return { set innerHTML(v) { mounted[sel] = v; } };
    }
  }
};
vm.createContext(sandbox);
vm.runInContext(dataMatch[1] + '\n' + tpl, sandbox, { filename: 'page-templates.js' });

writeFileSync(outJson, JSON.stringify({ mounted, warnings }, null, 2));
console.log(`mounts: ${Object.keys(mounted).length}`);
for (const k of Object.keys(mounted)) {
  console.log(`  ${k}  (${mounted[k].length} chars)`);
}
if (warnings.length) {
  console.log('warnings:');
  for (const w of warnings) console.log('  ! ' + w);
} else {
  console.log('warnings: none');
}
