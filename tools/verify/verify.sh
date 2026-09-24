#!/usr/bin/env bash
# One-shot regression check for the index.html data-layer migration.
#
#   verify.sh            compare rendered page against the captured baseline
#   verify.sh --accept   re-capture the baseline from the current rendered page
#                        (use only after an intentional content change)
set -u
S="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$S/../.." && pwd)"
B="$S/baseline"
WORK="$S/.work"
mkdir -p "$WORK"
cd "$REPO" || exit 1

fail=0

echo "== render =="
node "$S/render.mjs" index.html "$WORK/mounted.json" || exit 1
python3 "$S/splice.py" index.html "$WORK/mounted.json" "$WORK/rendered.html" || exit 1

echo
echo "== js syntax =="
rm -f "$WORK"/block*.js
python3 - "$WORK" <<'PY'
import re, sys, pathlib
out = pathlib.Path(sys.argv[1])
src = open('index.html', encoding='utf-8').read()
blocks = re.findall(r'<script(?![^>]*ld\+json)[^>]*>(.*?)</script>', src, re.S)
for i, b in enumerate(blocks):
    (out / f'block{i}.js').write_text(b, encoding='utf-8')
print(f'  {len(blocks)} script blocks')
PY
for f in "$WORK"/block*.js; do
  printf '  %-11s ' "$(basename "$f")"
  if node --check "$f" 2>&1; then echo OK; else fail=1; fi
done

echo
echo "== json-ld =="
python3 - <<'PY' || exit 1
import re, json
s = open('index.html', encoding='utf-8').read()
m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
d = json.loads(m.group(1))
print(f"  valid: {d['@type']} / {d['name']}")
PY

echo
echo "== html structure =="
python3 "$S/wellformed.py" "$WORK/rendered.html" || fail=1

echo
echo "== content vs baseline =="
python3 "$S/extract.py" "$WORK/rendered.html" text en   > "$WORK/r.text.en.txt"
python3 "$S/extract.py" "$WORK/rendered.html" text ja   > "$WORK/r.text.ja.txt"
python3 "$S/extract.py" "$WORK/rendered.html" links     > "$WORK/r.links.txt"
python3 "$S/extract.py" "$WORK/rendered.html" sections  > "$WORK/r.sections.txt"

if [ "${1:-}" = "--accept" ]; then
  mkdir -p "$B"
  for n in text.en text.ja links sections; do cp "$WORK/r.$n.txt" "$B/$n.txt"; done
  echo "  baseline re-captured from current page"
  exit 0
fi

for n in text.en text.ja links sections; do
  if diff -q "$B/$n.txt" "$WORK/r.$n.txt" >/dev/null 2>&1; then
    printf '  %-10s identical\n' "$n"
  else
    printf '  %-10s DIFF\n' "$n"
    diff "$B/$n.txt" "$WORK/r.$n.txt" | sed 's/^/      /'
    fail=1
  fi
done

echo
[ "$fail" = 0 ] && echo "ALL OK" || echo "FAILURES PRESENT"
exit $fail
