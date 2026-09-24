"""Checks tag balance on the rendered page. A dropped </div> in generated
markup fails silently in a browser, so catch it here instead."""
import sys
from html.parser import HTMLParser

VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr"}

class Check(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f'stray </{tag}> at line {self.getpos()[0]}')
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            depth = next((i for i, (t, _) in enumerate(reversed(self.stack)) if t == tag), None)
            if depth is None:
                self.errors.append(f'stray </{tag}> at line {self.getpos()[0]}')
            else:
                for _ in range(depth):
                    t, pos = self.stack.pop()
                    self.errors.append(f'<{t}> opened at line {pos[0]} never closed (found </{tag}>)')
                self.stack.pop()

c = Check()
c.feed(open(sys.argv[1], encoding='utf-8').read())
for t, pos in c.stack:
    c.errors.append(f'<{t}> opened at line {pos[0]} never closed (EOF)')
if c.errors:
    print(f'  {len(c.errors)} problem(s):')
    for e in c.errors[:20]:
        print('   -', e)
    sys.exit(1)
print('  tag balance OK')
