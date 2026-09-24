/* Renders the crowd simulation to a PNG without a browser.

   The physics block of the simulation is pure -- no DOM, no canvas -- so it
   can be pulled straight out of the page source and run here. Trails are
   accumulated into float buffers with the same exponential decay the live
   trail layer uses, supersampled 2x and box-filtered down, then composited
   with the real theme palette. It is close enough to the browser output to
   judge composition, density and tone from.

   usage: node preview.mjs <source.js|index.html> <out.png> [--theme dark]
                           [--w 1600] [--h 900] [--seconds 26] [--seed 42]
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

/* ---------- args ---------- */
const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const flag = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const SRC = positional[0];
const OUT = positional[1] || 'preview.png';
const THEME = flag('theme', 'light');
const PX_W = parseInt(flag('w', '1600'), 10);
const PX_H = parseInt(flag('h', '900'), 10);
const SECONDS = parseFloat(flag('seconds', '26'));
const SEED = parseInt(flag('seed', '20260924'), 10);
const SS = 2;                       // supersampling factor

/* ---------- pull the physics out of the source ---------- */
const src = readFileSync(SRC, 'utf8');
const begin = src.indexOf('@@PHYSICS-BEGIN@@');
const end = src.indexOf('@@PHYSICS-END@@');
if (begin < 0 || end < 0) throw new Error('physics markers not found in ' + SRC);
// Both markers sit inside comment blocks; take the code strictly between them.
const from = src.indexOf('*/', begin) + 2;
const to = src.lastIndexOf('/*', end);
const physics = src.slice(from, to);

const mod = new Function(physics + '\nreturn { createWorld, step, forecast, P, V };')();
const { createWorld, step, forecast, P, V } = mod;

/* ---------- palette, matching the stylesheet ---------- */
const THEMES = {
  light: { ink: [22, 21, 15], inkSoft: [122, 120, 112], accent: [232, 80, 10],
           paper: [253, 252, 249], stage: [239, 232, 216], hairline: [227, 221, 206] },
  dark:  { ink: [236, 233, 226], inkSoft: [165, 162, 154], accent: [255, 129, 68],
           paper: [33, 28, 21], stage: [20, 16, 11], hairline: [48, 42, 33] }
};
const T = THEMES[THEME];
T.trailLife = V.trailLife[THEME];
T.aA = T.aB = V.trailAlpha[THEME];
T.aAcc = V.accentAlpha[THEME];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const toneA = mix(T.ink, T.accent, THEME === 'dark' ? 0.34 : 0.40);
const toneB = THEME === 'dark' ? mix(T.inkSoft, T.paper, 0.30) : mix(T.inkSoft, T.ink, 0.18);

/* ---------- world ---------- */
const SCALE = Math.min(46, Math.max(20, PX_H / 26));
const world = createWorld(PX_W / SCALE, PX_H / SCALE, SEED);

const w = PX_W * SS, h = PX_H * SS;
const bufA = new Float32Array(w * h);
const bufB = new Float32Array(w * h);
const bufC = new Float32Array(w * h);

/* additive, bilinear-splatted line */
function splat(buf, x, y, amt) {
  if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) return;
  const xi = x | 0, yi = y | 0;
  const fx = x - xi, fy = y - yi;
  const i = yi * w + xi;
  buf[i] += amt * (1 - fx) * (1 - fy);
  buf[i + 1] += amt * fx * (1 - fy);
  buf[i + w] += amt * (1 - fx) * fy;
  buf[i + w + 1] += amt * fx * fy;
}

function line(buf, x0, y0, x1, y1, width, amt) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (!isFinite(len) || len > w) return;
  const steps = Math.max(1, Math.ceil(len));
  const half = Math.max(0.45, width * SS * 0.5);
  const nx = len > 1e-6 ? -dy / len : 0, ny = len > 1e-6 ? dx / len : 0;
  const lanes = Math.max(1, Math.ceil(half * 2));
  const per = amt;                 // parallel lanes cover different pixels
  for (let s = 1; s <= steps; s++) {
    const t = s / steps;
    const px = x0 + dx * t, py = y0 + dy * t;
    for (let l = 0; l < lanes; l++) {
      const o = lanes === 1 ? 0 : (l / (lanes - 1) - 0.5) * 2 * half;
      splat(buf, px + nx * o, py + ny * o, per);
    }
  }
}

function disc(buf, cx, cy, r, amt) {
  const r2 = r * r, x0 = Math.max(0, (cx - r) | 0), x1 = Math.min(w - 1, (cx + r + 1) | 0);
  const y0 = Math.max(0, (cy - r) | 0), y1 = Math.min(h - 1, (cy + r + 1) | 0);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d2 <= r2) buf[y * w + x] += amt * Math.min(1, (r2 - d2) / Math.max(1, r));
    }
  }
}

/* ---------- run ---------- */
const STEP = 1 / 60;
const total = Math.round(SECONDS / STEP);
const warm = Math.round(total * 0.45);
const decayPerStep = Math.exp(-STEP / T.trailLife);
const wide = SCALE * V.lineScale;

for (let n = 0; n < total; n++) {
  step(world, STEP, null);
  if (n < warm) continue;                      // let the crowd settle first
  const f = decayPerStep;
  for (let i = 0; i < bufA.length; i++) { bufA[i] *= f; bufB[i] *= f; bufC[i] *= f; }
  for (const a of world.agents) {
    if (a.life < 0.05) continue;
    const dx = a.x - a.px, dy = a.y - a.py;
    if (dx * dx + dy * dy > 4) continue;
    const buf = a.accent ? bufC : (a.flow === 0 ? bufA : bufB);
    const lw = a.accent ? wide * 1.7
      : wide * V.weights[a.wt] * (a.flow === 0 ? 1.05 : 0.9);
    const amt = a.accent ? T.aAcc : (a.flow === 0 ? T.aA : T.aB * 0.86);
    line(buf, a.px * SCALE * SS, a.py * SCALE * SS, a.x * SCALE * SS, a.y * SCALE * SS,
         Math.max(0.7, lw), amt);
  }
}

/* heads and obstacles, drawn once on the final frame */
const rHead = Math.max(1.2, SCALE * V.headScale) * SS;
for (const a of world.agents) {
  if (a.accent) continue;
  const rr = rHead * (0.78 + 0.34 * (a.r - P.radius[0]) / (P.radius[1] - P.radius[0]));
  disc(a.flow === 0 ? bufA : bufB, a.x * SCALE * SS, a.y * SCALE * SS, rr, 0.78);
}
const acc = world.accent;
if (acc) disc(bufC, acc.x * SCALE * SS, acc.y * SCALE * SS, rHead * 1.32, 1.0);

if (acc) {
  const fan = forecast(world, acc, [[], [], []]);
  for (let b = 0; b < 3; b++) {
    const p = fan[b];
    for (let i = 2; i < p.length; i += 2) {
      line(bufC, p[i - 2] * SCALE * SS, p[i - 1] * SCALE * SS, p[i] * SCALE * SS, p[i + 1] * SCALE * SS,
           b === 1 ? 1.3 : 0.9, b === 1 ? 0.5 : 0.28);
    }
  }
}

const bufO = new Float32Array(w * h);
for (const o of world.obstacles) {
  const cx = o.x * SCALE * SS, cy = o.y * SCALE * SS, r = o.r * SCALE * SS;
  for (let y = Math.max(0, (cy - r - 2) | 0); y <= Math.min(h - 1, (cy + r + 2) | 0); y++) {
    for (let x = Math.max(0, (cx - r - 2) | 0); x <= Math.min(w - 1, (cx + r + 2) | 0); x++) {
      const d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
      if (d <= r) bufO[y * w + x] = Math.max(bufO[y * w + x], THEME === 'dark' ? 0.05 : 0.10);
      if (Math.abs(d - r) < SS * 0.6) bufO[y * w + x] = 2;    // ring marker
    }
  }
}

/* ---------- composite + downsample ---------- */
const rgb = Buffer.alloc(PX_W * PX_H * 3);
const over = (dst, col, a) => { dst[0] += (col[0] - dst[0]) * a; dst[1] += (col[1] - dst[1]) * a; dst[2] += (col[2] - dst[2]) * a; };
const px = [0, 0, 0];
for (let y = 0; y < PX_H; y++) {
  for (let x = 0; x < PX_W; x++) {
    let sa = 0, sb = 0, sc = 0, so = 0;
    for (let sy = 0; sy < SS; sy++) {
      const row = (y * SS + sy) * w + x * SS;
      for (let sx = 0; sx < SS; sx++) {
        sa += bufA[row + sx]; sb += bufB[row + sx]; sc += bufC[row + sx]; so += bufO[row + sx];
      }
    }
    const inv = 1 / (SS * SS);
    sa *= inv; sb *= inv; sc *= inv; so *= inv;
    px[0] = T.stage[0]; px[1] = T.stage[1]; px[2] = T.stage[2];
    if (so > 0.001) {
      const ring = Math.max(0, Math.min(1, so - 1));      // 2 means "on the ring"
      over(px, T.paper, Math.min(1, so));
      if (ring > 0) over(px, T.ink, Math.min(1, ring * 2) * (THEME === 'dark' ? 0.26 : 0.30));
    }
    if (sb > 0.001) over(px, toneB, Math.min(0.92, sb));
    if (sa > 0.001) over(px, toneA, Math.min(0.94, sa));
    if (sc > 0.001) over(px, T.accent, Math.min(0.96, sc));
    const o = (y * PX_W + x) * 3;
    rgb[o] = Math.round(Math.max(0, Math.min(255, px[0])));
    rgb[o + 1] = Math.round(Math.max(0, Math.min(255, px[1])));
    rgb[o + 2] = Math.round(Math.max(0, Math.min(255, px[2])));
  }
}

/* ---------- PNG ---------- */
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  return (crc ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(PX_W, 0); ihdr.writeUInt32BE(PX_H, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const raw = Buffer.alloc(PX_H * (PX_W * 3 + 1));
for (let y = 0; y < PX_H; y++) {
  raw[y * (PX_W * 3 + 1)] = 0;
  rgb.copy(raw, y * (PX_W * 3 + 1) + 1, y * PX_W * 3, (y + 1) * PX_W * 3);
}
writeFileSync(OUT, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]));

/* ---------- report ---------- */
let minSep = Infinity, overlaps = 0;
const A = world.agents;
for (let i = 0; i < A.length; i++) {
  for (let j = i + 1; j < A.length; j++) {
    const d = Math.hypot(A[i].x - A[j].x, A[i].y - A[j].y);
    const R = A[i].r + A[j].r;
    if (d < minSep) minSep = d;
    if (d < R * 0.92) overlaps++;
  }
}
const speeds = A.map(a => Math.hypot(a.vx, a.vy));
const mean = speeds.reduce((s, v) => s + v, 0) / speeds.length;
const nan = A.some(a => !isFinite(a.x) || !isFinite(a.y) || !isFinite(a.vx));
console.log(`${OUT}  ${PX_W}x${PX_H} ${THEME}`);
console.log(`  world      ${world.w.toFixed(1)}m x ${world.h.toFixed(1)}m @ ${SCALE.toFixed(1)} px/m`);
console.log(`  agents     ${A.length}  (${world.groups.length} groups)  obstacles ${world.obstacles.length}`);
console.log(`  mean speed ${mean.toFixed(2)} m/s   min separation ${minSep.toFixed(2)} m   overlaps ${overlaps}`);
console.log(`  finite     ${nan ? 'NO -- instability' : 'yes'}`);
