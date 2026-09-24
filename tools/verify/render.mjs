/* Runs the page's DATA + template layer under Node with a stub document,
   and prints the HTML each mount() would write. Lets the migration be
   verified end to end without a browser. */
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const file = process.argv[2];
const outJson = process.argv[3];
const src = readFileSync(file, 'utf8');

// 1. the DATA block
const dataMatch = src.match(/@@DATA@@[\s\S]*?\*\/\s*(const DATA = \{[\s\S]*?\n\};)/);
if (!dataMatch) throw new Error('DATA block not found');

// 2. the template layer: from the @@TEMPLATES@@ banner up to the next banner
const tplStart = src.indexOf('const RAW = Symbol(');
if (tplStart < 0) throw new Error('template layer not found');
const tplEnd = src.indexOf('/* ====================================================================\n   LANGUAGE toggle', tplStart);
if (tplEnd < 0) throw new Error('end of template layer not found');
const tpl = src.slice(tplStart, tplEnd);

const mounted = {};
const warnings = [];
const sandbox = {
  console: { warn: (...a) => warnings.push(a.join(' ')), log: () => {} },
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
