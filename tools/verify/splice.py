"""Injects rendered mount HTML into a copy of the page so the static
extractor can be run against what a browser would actually show."""
import json, re, sys

src = open(sys.argv[1], encoding='utf-8').read()
mounted = json.load(open(sys.argv[2], encoding='utf-8'))['mounted']
for sel, html in mounted.items():
    assert sel.startswith('#'), f'only id selectors supported: {sel}'
    eid = sel[1:]
    pat = re.compile(r'(<(\w+)[^>]*\bid="' + re.escape(eid) + r'"[^>]*>)(</\2>)')
    src, n = pat.subn(lambda m: m.group(1) + html + m.group(3), src)
    assert n == 1, f'mount point {sel}: expected 1, got {n}'
open(sys.argv[3], 'w', encoding='utf-8').write(src)
print(f'spliced {len(mounted)} mount(s)')
