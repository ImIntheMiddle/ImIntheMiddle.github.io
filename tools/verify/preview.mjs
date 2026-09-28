#!/usr/bin/env node
/* Headless preview of the hero plaza.

   Pulls the physics and the plaza drawing out of index.html -- the blocks
   between @@PHYSICS-BEGIN@@/@@PHYSICS-END@@ and @@PLAZA-BEGIN@@/@@PLAZA-END@@,
   byte for byte -- and runs them against @napi-rs/canvas, so the picture is
   the page's own drawing rather than an imitation of it. The floor grid and
   the edge fade are CSS on the page; they are painted here by hand.

   This is a CPU rasteriser. Browsers draw the canvas on the GPU, so use it
   to see what the plaza looks like, not to time it.

     npm install            # once, in tools/verify
     node preview.mjs out.png [--w 1440] [--h 720] [--seconds 18] [--seed 7]
                              [--walk] [--dpr 2] [--crop x,y,w,h]              */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { createCanvas } = require('@napi-rs/canvas');

const args = process.argv.slice(2);
const flag = (n, d) => (args.indexOf('--' + n) >= 0 ? args[args.indexOf('--' + n) + 1] : d);
const OUT = args[0];
if (!OUT || OUT.startsWith('--')) { console.error('usage: node preview.mjs out.png [flags]'); process.exit(2); }
const W = +flag('w', 1440), H = +flag('h', 720), SECS = +flag('seconds', 18);
const SEED = +flag('seed', 7), DPR = +flag('dpr', 2), WALK = args.includes('--walk');

/* ---------- the page's own code ---------- */
const src = readFileSync(join(HERE, '..', '..', 'index.html'), 'utf8');
const block = (name) => {
  const b = src.indexOf(`@@${name}-BEGIN@@`), e = src.indexOf(`@@${name}-END@@`);
  if (b < 0 || e < 0) throw new Error(`${name} markers not found in index.html`);
  return src.slice(src.indexOf('*/', b) + 2, src.lastIndexOf('/*', e));
};
const { Plaza, SQ } = new Function(block('PHYSICS') + block('PLAZA') + '\nreturn { Plaza, SQ };')();
const css = (name, d) => (src.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`)) || [, d])[1];
const STAGE = css('stage', '#f4f5f9'), GRID = css('grid', '#e8eaf1');

/* ---------- run ---------- */
const pz = Plaza({ w: W, h: H, dpr: DPR, seed: SEED, makeCanvas: (w, h) => createCanvas(w, h) });
const layer = createCanvas(W * DPR, H * DPR), lctx = layer.getContext('2d');
let now = 0;
for (let i = 0; i < SECS * 60; i++) {
  if (WALK && i === Math.round((SECS - 5) * 60)) { pz.setWalking(true); pz.setKeys(0.8, -0.6); }
  pz.tick(1 / 60); now += 1000 / 60;
}
// a second of frames, so every staggered forecast has been filled in
for (let i = 0; i < 40; i++) { pz.tick(1 / 60); now += 1000 / 60; pz.draw(lctx, now); }

/* ---------- compose what the page composes ---------- */
const cv = createCanvas(W * DPR, H * DPR), g = cv.getContext('2d');
g.setTransform(DPR, 0, 0, DPR, 0, 0);
g.fillStyle = STAGE; g.fillRect(0, 0, W, H);
g.strokeStyle = GRID; g.lineWidth = 1;
for (let x = 0; x < W; x += 2 * pz.S) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
for (let y = 0; y < H; y += 2 * pz.S * SQ) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
g.setTransform(1, 0, 0, 1, 0, 0);
g.drawImage(layer, 0, 0);
g.setTransform(DPR, 0, 0, DPR, 0, 0);
const rgb = parseInt(STAGE.slice(1), 16), [r, gg, b] = [rgb >> 16, (rgb >> 8) & 255, rgb & 255];
const fade = (x0, y0, x1, y1, x, y, w, h) => {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, `rgba(${r},${gg},${b},1)`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr; g.fillRect(x, y, w, h);
};
fade(0, 0, 0, H * 0.09, 0, 0, W, H * 0.09);
fade(0, H, 0, H * 0.88, 0, H * 0.88, W, H * 0.12);
fade(0, 0, W * 0.05, 0, 0, 0, W * 0.05, H);
fade(W, 0, W * 0.95, 0, W * 0.95, 0, W * 0.05, H);

const crop = flag('crop', null);            // x,y,w,h in page px: a close look at the figures
if (crop) {
  const [cx, cy, cw, ch] = crop.split(',').map(Number);
  const out = createCanvas(cw * DPR, ch * DPR);
  out.getContext('2d').drawImage(cv, cx * DPR, cy * DPR, cw * DPR, ch * DPR, 0, 0, cw * DPR, ch * DPR);
  writeFileSync(OUT, out.toBuffer('image/png'));
} else writeFileSync(OUT, cv.toBuffer('image/png'));

/* ---------- report ---------- */
const w = pz.world, you = w.accent, px = (a) => `${Math.round(a.x * pz.S)},${Math.round(a.y * pz.S * SQ)}`;
console.log(`${OUT}  ${W}x${H}${WALK ? '  walking' : ''}  seed ${SEED}  ${w.agents.length} walkers  ${pz.S.toFixed(1)} px/m`);
console.log(`  you        ${px(you)}`);
for (const a of w.agents) if (a._kind) console.log(`  ${a._kind.padEnd(10)} ${px(a)}`);
for (const d of pz.drones) console.log(`  drone      ${Math.round(d.x * pz.S)},${Math.round(d.y * pz.S * SQ - d.z * pz.S * Math.sqrt(1 - SQ * SQ))}`);
