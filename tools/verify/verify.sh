#!/usr/bin/env bash
# One-shot regression check for index.html and publications.html.
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

# Each page is rendered and checked; the home page also carries the JSON-LD.
# Baselines are named <page>.<kind>.txt, the home page's without a prefix.
PAGES="index publications"
prefix() { [ "$1" = index ] && echo "" || echo "$1."; }

for page in $PAGES; do
  echo "== render: $page.html =="
  node "$S/render.mjs" "$page.html" "$WORK/$page.mounted.json" || exit 1
  python3 "$S/splice.py" "$page.html" "$WORK/$page.mounted.json" "$WORK/$page.rendered.html" || exit 1
  echo
done

echo "== js syntax =="
rm -f "$WORK"/block*.js
python3 - "$WORK" $PAGES <<'PY'
import re, sys, pathlib
out = pathlib.Path(sys.argv[1])
n = 0
for page in sys.argv[2:]:
    src = open(f'{page}.html', encoding='utf-8').read()
    blocks = re.findall(r'<script(?![^>]*ld\+json)(?![^>]*\bsrc=)[^>]*>(.*?)</script>', src, re.S)
    for i, b in enumerate(blocks):
        (out / f'block.{page}.{i}.js').write_text(b, encoding='utf-8')
    n += len(blocks)
print(f'  {n} inline script blocks')
PY
for f in "$WORK"/block*.js static/js/*.js; do
  printf '  %-22s ' "$(basename "$f")"
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

for page in $PAGES; do
  R="$WORK/$page.rendered.html"
  echo
  echo "== html structure: $page.html =="
  python3 "$S/wellformed.py" "$R" || fail=1

  echo
  echo "== local assets: $page.html =="
  python3 - "$R" <<'PY' || fail=1
import re, sys, os
html = open(sys.argv[1], encoding='utf-8').read()
# Script bodies still hold the template source, whose href="${l.href}" would
# otherwise be reported as a missing file.
html = re.sub(r'(<script[^>]*>).*?</script>', r'\1</script>', html, flags=re.S)
refs = set()
for attr, val in re.findall(r'\b(href|src)="([^"]+)"', html):
    if re.match(r'^(https?:)?//|^(mailto|tel|data):|^#|^$', val):
        continue
    refs.add(val.split('#')[0].split('?')[0] or 'index.html')
refs = {'index.html' if r in ('./', '.') else r for r in refs}
bad = sorted(r for r in refs if not os.path.isfile(r))
for r in sorted(refs):
    print(f"  {'MISSING' if r in bad else 'ok     '}  {r}")
if not refs:
    print("  (no local assets referenced)")
sys.exit(1 if bad else 0)
PY

  echo
  echo "== content vs baseline: $page.html =="
  P="$(prefix "$page")"
  python3 "$S/extract.py" "$R" text en   > "$WORK/r.${P}text.en.txt"
  python3 "$S/extract.py" "$R" text ja   > "$WORK/r.${P}text.ja.txt"
  python3 "$S/extract.py" "$R" links     > "$WORK/r.${P}links.txt"
  python3 "$S/extract.py" "$R" sections  > "$WORK/r.${P}sections.txt"

  for n in text.en text.ja links sections; do
    if [ "${1:-}" = "--accept" ]; then
      mkdir -p "$B"; cp "$WORK/r.$P$n.txt" "$B/$P$n.txt"
    elif diff -q "$B/$P$n.txt" "$WORK/r.$P$n.txt" >/dev/null 2>&1; then
      printf '  %-10s identical\n' "$n"
    else
      printf '  %-10s DIFF\n' "$n"
      diff "$B/$P$n.txt" "$WORK/r.$P$n.txt" 2>&1 | sed 's/^/      /'
      fail=1
    fi
  done
  [ "${1:-}" = "--accept" ] && echo "  baseline re-captured from current page"
done

echo
[ "$fail" = 0 ] && echo "ALL OK" || echo "FAILURES PRESENT"
exit $fail
