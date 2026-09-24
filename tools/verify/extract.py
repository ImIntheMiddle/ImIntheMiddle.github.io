#!/usr/bin/env python3
"""Baseline extractor for index.html regression checks.

Simulates the page's CSS language toggle ([data-lang=en] .ja {display:none})
and the #blog display:none hack, then dumps visible text, links, and section
indices. Used to prove that data-layer migration steps are content-neutral.
"""

import sys
import re
from html.parser import HTMLParser

VOID = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
SKIP_TAGS = {"style", "script", "head", "title"}
# Inline tags that should not introduce whitespace when extracting text.
INLINE = {"span", "a", "b", "i", "em", "strong", "sup", "sub", "code", "small"}


class Extractor(HTMLParser):
    def __init__(self, lang):
        super().__init__(convert_charrefs=True)
        self.lang = lang
        self.other = "ja" if lang == "en" else "en"
        self.stack = []  # open tags
        self.hidden_depth = 0  # >0 while inside hidden subtree
        self.skip_depth = 0  # >0 while inside style/script
        self.out = []
        self.links = []
        self.sections = []  # (section_id, idx_text)
        self._cur_section = None
        self._idx_capture = None

    def _hidden(self, tag, attrs):
        d = dict(attrs)
        cls = (d.get("class") or "").split()
        if self.other in cls:
            return True
        # #blog and its nav link are display:none !important in the stylesheet
        if d.get("id") == "blog":
            return True
        if tag == "a" and d.get("href") == "#blog":
            return True
        # Controls ship every state in markup and swap via CSS. Model the
        # resting state: walk mode off, light theme, current language.
        if "lbl-on" in cls:
            return True
        if "thm-light" in cls:
            return True
        if f"lang-to-{self.lang}" in cls:
            return True
        return False

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag in SKIP_TAGS:
            self.skip_depth += 1
            self.stack.append((tag, False, True))
            return
        hid = self.hidden_depth > 0 or self._hidden(tag, attrs)
        if not hid and self.hidden_depth == 0:
            if tag == "section" and d.get("id"):
                self._cur_section = d["id"]
            cls = (d.get("class") or "").split()
            if "idx" in cls:
                self._idx_capture = []
            if tag == "a" and d.get("href"):
                self.links.append(d["href"])
            if tag == "img" and d.get("src"):
                self.links.append("IMG:" + d["src"])
        if self._hidden(tag, attrs):
            self.hidden_depth += 1
        if tag not in VOID:
            self.stack.append((tag, self._hidden(tag, attrs), False))
        elif not hid and tag == "br":
            self.out.append(" ")

    def handle_endtag(self, tag):
        while self.stack:
            t, was_hidden, was_skip = self.stack.pop()
            if was_skip:
                self.skip_depth -= 1
            elif was_hidden:
                self.hidden_depth -= 1
            if t == tag:
                break
        if tag not in INLINE and self.skip_depth == 0 and self.hidden_depth == 0:
            self.out.append("\n")

    def handle_data(self, data):
        if self.skip_depth or self.hidden_depth:
            return
        if self._idx_capture is not None:
            self._idx_capture.append(data)
            if data.strip():
                self.sections.append((self._cur_section or "-", data.strip()))
                self._idx_capture = None
        self.out.append(data)

    def text(self):
        s = "".join(self.out)
        s = re.sub(r"[ \t　]+", " ", s)
        s = re.sub(r" *\n *", "\n", s)
        s = re.sub(r"\n{2,}", "\n", s)
        return s.strip()


def run(path, lang):
    src = open(path, encoding="utf-8").read()
    p = Extractor(lang)
    p.feed(src)
    return p


if __name__ == "__main__":
    path = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "text"
    lang = sys.argv[3] if len(sys.argv) > 3 else "en"
    p = run(path, lang)
    if mode == "text":
        print(p.text())
    elif mode == "links":
        print("\n".join(sorted(set(p.links))))
    elif mode == "sections":
        for sid, idx in p.sections:
            print(f"{sid}\t{idx}")
