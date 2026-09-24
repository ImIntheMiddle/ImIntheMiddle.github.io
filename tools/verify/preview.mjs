/* Renders the crowd simulation to a PNG without a browser.

   The physics block of the simulation is pure -- no DOM, no canvas -- so it
   can be pulled straight out of the page source and run here. Trails are
   accumulated into a premultiplied RGBA float buffer with the same
   exponential decay the live trail layer uses, supersampled 2x and
   box-filtered down, then composited on the stage colour. Close enough to
   the browser output to judge composition, density and colour from.

   usage: node preview.mjs <index.html> <out.png>
          [--w 1600] [--h 900] [--seconds 40] [--seed N] [--walk]
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith('--'));
const flag = (n, d) => (args.indexOf('--' + n) >= 0 ? args[args.indexOf('--' + n) + 1] : d);
const SRC = pos[0];
const OUT = pos[1] || 'preview.png';
const PX_W = parseInt(flag('w', '1600'), 10);
const PX_H = parseInt(flag('h', '900'), 10);
const SECONDS = parseFloat(flag('seconds', '40'));
const SEED = parseInt(flag('seed', '20260924'), 10);
const WALK = args.includes('--walk');
const SS = 2;

/* ---------- pull the physics out of the page ---------- */
const src = readFileSync(SRC, 'utf8');
const b0 = src.indexOf('@@PHYSICS-BEGIN@@');
const e0 = src.indexOf('@@PHYSICS-END@@');
if (b0 < 0 || e0 < 0) throw new Error('physics markers not found in ' + SRC);
const physics = src.slice(src.indexOf('*/', b0) + 2, src.lastIndexOf('/*', e0));
const mod = new Function(physics + '\nreturn { createWorld, step, forecast, P, V };')();
const { createWorld, step, forecast, P, V } = mod;

/* ---------- palette, read back out of :root ---------- */
function cssRGB(name, fallback) {
  const m = src.match(new RegExp('--' + name + '-rgb:\\s*([0-9]+),\\s*([0-9]+),\\s*([0-9]+)'));
  return m ? [+m[1], +m[2], +m[3]] : fallback;
}
const STAGE = cssRGB('stage', [10, 11, 15]);
const PAPER = cssRGB('paper', [19, 21, 27]);
const INK = cssRGB('ink', [233, 234, 240]);
const ACCENT = cssRGB('accent', [255, 138, 76]);

/* ---------- world ---------- */
const SCALE = Math.min(46, Math.max(20, PX_H / 26));
const world = createWorld(PX_W / SCALE, PX_H / SCALE, SEED);

const w = PX_W * SS, h = PX_H * SS, N = w * h;
/* Premultiplied accumulation: eight hues would need eight coverage buffers,
   four channels covers any number of them. */
const bR = new Float32Array(N), bG = new Float32Array(N), bB = new Float32Array(N);
const bA = new Float32Array(N);

function splat(x, y, col, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= w - 1 || y >= h - 1) return;
  const xi = x | 0, yi = y | 0;
  const fx = x - xi, fy = y - yi;
  const i = yi * w + xi;
  const wts = [(1 - fx) * (1 - fy), fx * (1 - fy), (1 - fx) * fy, fx * fy];
  const idx = [i, i + 1, i + w, i + w + 1];
  for (let k = 0; k < 4; k++) {
    const q = a * wts[k], j = idx[k];
    bA[j] += q; bR[j] += q * col[0]; bG[j] += q * col[1]; bB[j] += q * col[2];
  }
}

function line(x0, y0, x1, y1, width, col, a) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (!isFinite(len) || len > w) return;
  const steps = Math.max(1, Math.ceil(len));
  const half = Math.max(0.45, width * SS * 0.5);
  const nx = len > 1e-6 ? -dy / len : 0, ny = len > 1e-6 ? dx / len : 0;
  const lanes = Math.max(1, Math.ceil(half * 2));
  for (let s = 1; s <= steps; s++) {
    const t = s / steps, px = x0 + dx * t, py = y0 + dy * t;
    for (let l = 0; l < lanes; l++) {
      const o = lanes === 1 ? 0 : (l / (lanes - 1) - 0.5) * 2 * half;
      splat(px + nx * o, py + ny * o, col, a);
    }
  }
}

function disc(cx, cy, r, col, a) {
  const r2 = r * r;
  for (let y = Math.max(0, (cy - r) | 0); y <= Math.min(h - 1, (cy + r + 1) | 0); y++) {
    for (let x = Math.max(0, (cx - r) | 0); x <= Math.min(w - 1, (cx + r + 1) | 0); x++) {
      const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d2 > r2) continue;
      const q = a * Math.min(1, (r2 - d2) / Math.max(1, r));
      const j = y * w + x;
      bA[j] += q; bR[j] += q * col[0]; bG[j] += q * col[1]; bB[j] += q * col[2];
    }
  }
}

function ring(cx, cy, r, width, col, a) {
  const steps = Math.max(28, Math.round(r * 5));
  for (let k = 0; k < steps; k++) {
    const t0 = (k / steps) * Math.PI * 2, t1 = ((k + 1) / steps) * Math.PI * 2;
    line(cx + Math.cos(t0) * r, cy + Math.sin(t0) * r,
         cx + Math.cos(t1) * r, cy + Math.sin(t1) * r, width, col, a);
  }
}

/* ---------- run ---------- */
const STEP = 1 / 60;
const total = Math.round(SECONDS / STEP);
const warm = Math.round(total * 0.55);
const decay = Math.exp(-STEP / V.trailLife);
const wide = SCALE * V.lineScale;
const S = SCALE * SS;

for (let n = 0; n < total; n++) {
  step(world, STEP, null);
  if (n < warm) continue;
  for (let i = 0; i < N; i++) { bA[i] *= decay; bR[i] *= decay; bG[i] *= decay; bB[i] *= decay; }
  for (const a of world.agents) {
    if (a.life < 0.05) continue;
    const dx = a.x - a.px, dy = a.y - a.py;
    if (dx * dx + dy * dy > 4) continue;
    const col = a.accent ? ACCENT : (a.flow === 0 ? V.warm : V.cool)[a.hue];
    const lw = a.accent ? wide * 1.7 : wide * V.weights[a.wt];
    line(a.px * S, a.py * S, a.x * S, a.y * S, Math.max(0.7, lw), col,
         a.accent ? V.accentAlpha : V.trailAlpha);
  }
}

/* walking knocks the accumulated past back, as drawLive does */
if (WALK) {
  const k = 1 - 0.66;
  for (let i = 0; i < N; i++) { bA[i] *= k; bR[i] *= k; bG[i] *= k; bB[i] *= k; }
}

/* ---------- final frame: obstacles, interactions, heads, player ------- */
for (const o of world.obstacles) {
  ring(o.x * S, o.y * S, o.r * S, 1.15, INK, WALK ? 0.12 : 0.18);
  disc(o.x * S, o.y * S, o.r * S, PAPER, 0.05);
}

for (let i = 0; i < world.linkCount; i++) {
  const li = i * 5, f = world.links[li + 4];
  const b = f > 6 ? 2 : f > 2 ? 1 : 0;
  line(world.links[li] * S, world.links[li + 1] * S,
       world.links[li + 2] * S, world.links[li + 3] * S,
       0.7 + b * 0.4, ACCENT, [0.13, 0.24, 0.44][b] * (WALK ? 0.7 : 1));
}

const rHead = Math.max(1.4, SCALE * V.headScale) * SS;
for (const a of world.agents) {
  if (a.accent) continue;
  const col = (a.flow === 0 ? V.warm : V.cool)[a.hue];
  if (a.hot >= P.flareShow) {
    disc(a.x * S, a.y * S, rHead * a.hs * (1.7 + Math.min(1.6, a.hot / 9)),
         col, WALK ? 0.10 : 0.16);
  }
  disc(a.x * S, a.y * S, rHead * a.hs, col, WALK ? 0.5 : 0.88);
}

const acc = world.accent;
if (acc) {
  const ax = acc.x * S, ay = acc.y * S;
  if (!WALK) {
    const fan = forecast(world, acc, [[], [], []]);
    for (let b = 0; b < 3; b++) {
      const p = fan[b];
      for (let i = 2; i < p.length; i += 2) {
        line(p[i - 2] * S, p[i - 1] * S, p[i] * S, p[i + 1] * S,
             b === 1 ? 1.3 : 0.9, ACCENT, b === 1 ? 0.5 : 0.28);
      }
    }
  }
  const gr = rHead * (WALK ? 9 : 5.5);
  for (let y = Math.max(0, (ay - gr) | 0); y <= Math.min(h - 1, (ay + gr) | 0); y++) {
    for (let x = Math.max(0, (ax - gr) | 0); x <= Math.min(w - 1, (ax + gr) | 0); x++) {
      const d = Math.hypot(x - ax, y - ay);
      if (d >= gr) continue;
      const q = (WALK ? 0.40 : 0.26) * (1 - d / gr), j = y * w + x;
      bA[j] += q; bR[j] += q * ACCENT[0]; bG[j] += q * ACCENT[1]; bB[j] += q * ACCENT[2];
    }
  }
  disc(ax, ay, rHead * (WALK ? 3.4 : 2.7), ACCENT, 1.0);
  disc(ax, ay, rHead * (WALK ? 1.7 : 1.35), [255, 255, 255], 0.96);
  if (!WALK) ring(ax, ay, rHead * 5.0, 1.0, ACCENT, 0.34);
  if (WALK) {
    ring(ax, ay, rHead * 5.2, 1.4, ACCENT, 0.75);
    ring(ax, ay, rHead * 8.1, 1.0, ACCENT, 0.30);
    for (let k = 0; k < 4; k++) {
      const an = (k * Math.PI) / 2, c = Math.cos(an), sn = Math.sin(an);
      line(ax + c * rHead * 6.4, ay + sn * rHead * 6.4,
           ax + c * rHead * 8.4, ay + sn * rHead * 8.4, 1.2, ACCENT, 0.6);
    }
  }
}

/* ---------- composite + downsample ---------- */
const rgb = Buffer.alloc(PX_W * PX_H * 3);
const edgeM = Math.min(PX_W, PX_H) * 0.09;
for (let y = 0; y < PX_H; y++) {
  for (let x = 0; x < PX_W; x++) {
    let sr = 0, sg = 0, sb = 0, sa = 0;
    for (let sy = 0; sy < SS; sy++) {
      const row = (y * SS + sy) * w + x * SS;
      for (let sx = 0; sx < SS; sx++) {
        const j = row + sx;
        sr += bR[j]; sg += bG[j]; sb += bB[j]; sa += bA[j];
      }
    }
    const inv = 1 / (SS * SS);
    sr *= inv; sg *= inv; sb *= inv; sa *= inv;
    let r = STAGE[0], g = STAGE[1], bl = STAGE[2];
    if (sa > 1e-4) {
      const k = Math.min(1, sa), n = k / sa;
      r = STAGE[0] * (1 - k) + sr * n;
      g = STAGE[1] * (1 - k) + sg * n;
      bl = STAGE[2] * (1 - k) + sb * n;
    }
    const ex = Math.min(x, PX_W - 1 - x), ey = Math.min(y, PX_H - 1 - y);
    const fade = Math.min(1, Math.max(ex < edgeM ? 1 - ex / edgeM : 0,
                                      ey < edgeM ? 1 - ey / edgeM : 0));
    if (fade > 0) {
      r += (STAGE[0] - r) * fade; g += (STAGE[1] - g) * fade; bl += (STAGE[2] - bl) * fade;
    }
    const o = (y * PX_W + x) * 3;
    rgb[o] = Math.max(0, Math.min(255, Math.round(r)));
    rgb[o + 1] = Math.max(0, Math.min(255, Math.round(g)));
    rgb[o + 2] = Math.max(0, Math.min(255, Math.round(bl)));
  }
}

/* ---------- PNG ---------- */
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
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
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, c]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(PX_W, 0); ihdr.writeUInt32BE(PX_H, 4);
ihdr[8] = 8; ihdr[9] = 2;
const raw = Buffer.alloc(PX_H * (PX_W * 3 + 1));
for (let y = 0; y < PX_H; y++) {
  raw[y * (PX_W * 3 + 1)] = 0;
  rgb.copy(raw, y * (PX_W * 3 + 1) + 1, y * PX_W * 3, (y + 1) * PX_W * 3);
}
writeFileSync(OUT, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]));

/* ---------- report ---------- */
const A = world.agents;
let minSep = Infinity, overlaps = 0;
for (let i = 0; i < A.length; i++) {
  for (let j = i + 1; j < A.length; j++) {
    const d = Math.hypot(A[i].x - A[j].x, A[i].y - A[j].y);
    if (d < minSep) minSep = d;
    if (d < (A[i].r + A[j].r) * 0.92) overlaps++;
  }
}
const mean = A.reduce((s, a) => s + Math.hypot(a.vx, a.vy), 0) / A.length;
console.log(`${OUT}  ${PX_W}x${PX_H}${WALK ? '  walk' : ''}`);
console.log(`  world      ${world.w.toFixed(1)}m x ${world.h.toFixed(1)}m @ ${SCALE.toFixed(1)} px/m`);
console.log(`  agents     ${A.length}  (${world.groups.length} groups)  obstacles ${world.obstacles.length}`);
console.log(`  mean speed ${mean.toFixed(2)} m/s   min separation ${minSep.toFixed(2)} m   overlaps ${overlaps}`);
console.log(`  finite     ${A.some(a => !isFinite(a.x) || !isFinite(a.vx)) ? 'NO' : 'yes'}`);
