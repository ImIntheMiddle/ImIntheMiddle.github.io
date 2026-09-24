#!/usr/bin/env python3
"""Composites the hero over a rendered background so the balance between
legibility and the drawing underneath can actually be looked at.

Reads the paper-clearing gradient and the hero grid out of index.html's own
values rather than guessing, draws block shapes where the type sits, and
writes a PNG. It is a massing study, not a typesetting preview: the point is
whether the clearing is too heavy, not what the letters look like.

usage: heromock.py <background.png> <out.png> [--theme light|dark]
                   [--centre 0.94] [--mid 0.74] [--edge 0.76]
"""

import sys
import zlib
import struct
import math

args = sys.argv[1:]
pos = [a for a in args if not a.startswith("--")]


def flag(name, default):
    if "--" + name in args:
        return args[args.index("--" + name) + 1]
    return default


SRC, OUT = pos[0], pos[1]
THEME = flag("theme", "light")
A_CENTRE = float(flag("centre", "0.94"))
A_MID = float(flag("mid", "0.74"))
EDGE = float(flag("edge", "0.76"))
CX = float(flag("cx", "0.34"))
CY = float(flag("cy", "0.44"))
RX = float(flag("rx", "1.18"))
RY = float(flag("ry", "0.88"))
PLATEAU = float(flag("plateau", "0.44"))

PAPER = (253, 252, 249) if THEME == "light" else (33, 28, 21)
INK = (22, 21, 15) if THEME == "light" else (236, 233, 226)
DIM = (91, 89, 82) if THEME == "light" else (165, 162, 154)
ACCENT = (187, 62, 10) if THEME == "light" else (255, 129, 68)
HAIR = (227, 221, 206) if THEME == "light" else (48, 42, 33)


def read_png(path):
    d = open(path, "rb").read()
    assert d[:8] == b"\x89PNG\r\n\x1a\n"
    i, idat, w, h = 8, b"", 0, 0
    while i < len(d):
        ln = struct.unpack(">I", d[i : i + 4])[0]
        typ = d[i + 4 : i + 8]
        body = d[i + 8 : i + 8 + ln]
        if typ == b"IHDR":
            w, h, bd, ct = struct.unpack(">IIBB", body[:10])
            assert bd == 8 and ct == 2, "expecting 8-bit RGB"
        elif typ == b"IDAT":
            idat += body
        i += 12 + ln
    raw = zlib.decompress(idat)
    stride = w * 3
    out = bytearray(w * h * 3)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        f = raw[p]
        p += 1
        line = bytearray(raw[p : p + stride])
        p += stride
        if f == 1:
            for x in range(3, stride):
                line[x] = (line[x] + line[x - 3]) & 255
        elif f == 2:
            for x in range(stride):
                line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x - 3] if x >= 3 else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x - 3] if x >= 3 else 0
                b = prev[x]
                c = prev[x - 3] if x >= 3 else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out[y * stride : (y + 1) * stride] = line
        prev = line
    return w, h, out


def write_png(path, w, h, buf):
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        raw += buf[y * w * 3 : (y + 1) * w * 3]

    def chunk(t, b):
        c = t + b
        return (
            struct.pack(">I", len(b))
            + c
            + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        )

    open(path, "wb").write(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


W, H, buf = read_png(SRC)


def blend(x, y, col, a):
    if a <= 0 or x < 0 or y < 0 or x >= W or y >= H:
        return
    o = (y * W + x) * 3
    for k in range(3):
        buf[o + k] = int(buf[o + k] + (col[k] - buf[o + k]) * min(1.0, a))


# ---- the paper clearing, as .hero-block .wrap::before defines it ----------
# radial-gradient(118% 88% at 34% 44%) over a box inset -6% -10% -10%
cx, cy = CX * W, CY * H
rx, ry = RX * W * 0.5, RY * H * 0.5
for y in range(H):
    for x in range(W):
        t = math.hypot((x - cx) / rx, (y - cy) / ry)
        if t >= EDGE:
            continue
        if t <= PLATEAU:
            a = A_CENTRE + (A_MID - A_CENTRE) * (t / PLATEAU)
        else:
            a = A_MID * (1 - (t - PLATEAU) / (EDGE - PLATEAU))
        blend(x, y, PAPER, a)

# ---- massing for the hero type -------------------------------------------
frame = min(1200, W - 168)
left = (W - frame) // 2
col = frame / 12.0


def bar(x, y, w, h, col_, a=1.0):
    for yy in range(int(y), int(y + h)):
        for xx in range(int(x), int(x + w)):
            blend(xx, yy, col_, a)


top = int(H * 0.30)
# eyebrow
bar(left, top, col * 3.4, 11, ACCENT, 0.85)
# name, two lines at the h1 clamp ceiling
nameSize = min(108, max(48, W * 0.074))
bar(left, top + 34, col * 5.6, nameSize * 0.70, INK, 0.92)
bar(left, top + 34 + nameSize * 0.96, col * 6.6, nameSize * 0.70, INK, 0.92)
# the measured rule under the name
ruleY = int(top + 34 + nameSize * 0.96 + nameSize * 0.70 + 26)
bar(left, ruleY, frame, 1, HAIR, 1.0)
bar(left, ruleY, col * 6.6, 1, ACCENT, 1.0)
# sub-line
bar(left, ruleY + 18, col * 5.0, 13, DIM, 0.8)
LAYOUT = flag("layout", "rail")
if LAYOUT == "rail":
    # meta rail on the right, columns 9-12
    railX = left + col * 8.4
    bar(railX - 18, top + 30, 1, nameSize * 1.9, HAIR, 1.0)
    for i in range(3):
        yy = top + 34 + i * 62
        bar(railX, yy, col * 1.5, 9, DIM, 0.75)
        bar(railX, yy + 17, col * 3.1, 15, INK, 0.85)
    textRight = frame
else:
    textRight = col * 7.0

# lede
for i, wfrac in enumerate((6.4, 5.8, 3.2) if LAYOUT == "rail" else (6.2, 5.4, 2.8)):
    bar(left, ruleY + 62 + i * 30, col * wfrac, 17, INK, 0.80)

y = ruleY + 172
if LAYOUT == "left":
    # meta as a row under the lede, the way the mobile layout already does it
    bar(left, y, textRight, 1, HAIR, 1.0)
    for i in range(3):
        xx = left + i * (textRight / 3)
        bar(xx, y + 14, col * 1.3, 9, DIM, 0.75)
        bar(xx, y + 31, col * 1.9, 15, INK, 0.85)
    y += 76

# chips
cxp = left
for wfrac, solid in (
    (1.5, True),
    (1.4, False),
    (1.5, False),
    (1.7, False),
    (0.9, False),
    (1.0, False),
):
    bar(cxp, y, col * wfrac, 34, INK if solid else HAIR, 1.0 if solid else 0.9)
    cxp += col * wfrac + 10

# mission band
mb = y + 64
bar(left, mb, textRight, 1, HAIR, 1.0)
bar(left, mb + 30, col * 1.8, 10, ACCENT, 0.85)
bar(left + col * 2.4, mb + 22, col * 4.2, 30, INK, 0.9)
bar(left, mb + 84, textRight, 1, HAIR, 1.0)

write_png(OUT, W, H, buf)
print(f"{OUT}  {W}x{H} {THEME}  clearing {A_CENTRE}/{A_MID} to {EDGE}")
