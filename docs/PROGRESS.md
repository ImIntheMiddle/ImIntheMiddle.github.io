# Progress

## 2026-11-28 (layout and plaza revision, pushed as 7f27232; checks in a real browser remain)

Owner approved every item of a design review on 2026-11-27, with three conditions: news emoji stay, the crowd reacts more strongly and from further off, and publication videos always play.

Done in the working tree (dl50, `node` at `/usr/bin/node`):

- `publications.html`: the venue column no longer overlaps the title; the supplementary text wraps (`static/css/site.css`, `.pub .venue .rate`).
- Filled badges are for venues and awards (`**…**` in the data); the author role and "Oral" are `*…*` and set in ink.
- Links in running text share one style (accent, underline on hover). Portrait has a 12 px radius and no border. Reveal is 0.35 s over 8 px. Cross-page view transition keeps the header. Phone hero is `max(540px, 68vh)`.
- News shows five items and the award, funding, service and experience lists show the entries marked `key: true` in `static/js/data.js`; a button under each list shows the rest (`moreBtn`, `.foldable`, `.extra`; handler in `static/js/ui.js`). The `key` choice is Claude's proposal and awaits the owner's review.
- The Springer notice sits in a `<details>` under the links.
- Section numbers are gone; a table of contents (`#toc`) stands left of the column from 1240 px, shown past the hero, marking the section being read.
- Plaza (`index.html`): the steered walker and the mouse pointer are "presences" (`world.presences`, constants `P.you*`): noticed from 16 m, wider berth. A mouse over the hero moves the crowd without walk mode, and paths and forecasts are drawn round the pointer. After a walk the hero shows the distance and the mean miss of 2-second-ahead forecasts (`scoreWalk`, `.walk-result`). Drawing interpolates between physics steps (`st.draw(ctx, now, alpha)`).
- Headless physics check (three seeds, 20 s straight walk): people within 3 m of the steered walker fell from 2.1–2.8 to 0.7–1.7 on average; people within 1.5 m of a resting pointer fell from 1.1–1.9 to 0.
- `tools/verify/extract.py` records section ids in page order instead of the removed numbers.
- Animation quality (owner asked for all three directions):
  - Figures: the trunk leans with acceleration and into turns (`_lean`, `_roll` in `st.tick`), the head turns toward whoever the walker is making way for (`gaze`, `a.ex`/`a.ey` set in `step`), a standing figure shifts its weight.
  - Behaviour: parties stop to talk (`P.chat`, `P.chatFor`, `a.pause`), about one in eight solo walkers is slowed by a phone (`_phone`), two prams and two bicycles are pushed on a desktop plaza (`castProps`, `_push`), people sit on planter rims (`ob._sit`, `sitter`).
  - Rendering: figures throw a shadow along `SUN`, tree crowns drift, `FIG` is 1.18.
- Link-preview image `static/img/og-card.png` (1200x630): captured from `index.html?card&seed=5` (the `?card` class hides the header and the hero links) in headless Chromium with `--force-prefers-reduced-motion --window-size=1200,875`, cropped to the top 630 px. Both pages carry `og:image` and `twitter:card` `summary_large_image`.

Remaining:

- Pointer avoidance, the walk result, the table of contents and the frame rate with the added figures and shadows are not yet checked in a real browser (headless Chromium cannot hover and draws on the CPU).
- The owner declined a research-theme section (2026-11-27).
- Wording review of all visible text, English and Japanese, applied on 2026-11-28 with the owner's decisions: the greeting "Hi! 👋" and the acceptance rates stay, "English Step-Up points" stays (official name), the undergraduate scholarship reads "tuition reduction", and the two Hexa-P news items (acceptance, publication) are one item. Declined: dropping DC1 from the hero, new date formats, translated news tags and link labels, a Japanese summary of the Springer notice. The Japanese page now has Japanese venue notes (`rate` and `venue` as `{en, ja}` pairs) and video descriptions.
- `tools/verify/verify.sh --accept` re-captured the baselines after the wording changes; ALL OK.

## 2026-11-10 (Hexa-P published)

- Hexa-P was published online on 2026-11-09: Pattern Analysis and Applications 29(4), article 221, DOI 10.1007/s10044-026-01804-x (Crossref; https://doi.org/10.1007/s10044-026-01804-x redirects to the Springer article). The article is not open access, so the accepted-manuscript PDF stays.
- The Hexa-P entry is dated 2026 / 11, no longer says "accepted", links "Springer" to the DOI before "PDF", and its notice ends with Springer's sentence "The Version of Record is available online at: <DOI URL>".
- Every first-author paper (Hexa-P, Re-EmLoco, EmLoco, VATL4Pose, MVA 2023) now ends its `rate` with "**first author**" in bold, as the co-authored papers end with "co-author" (owner's request).
- Added a 2026 / 11 news item that Hexa-P is published in Pattern Analysis and Applications; the October acceptance item is kept.
- CV: the journal entry is dated Nov. 2026 and drops "(accepted)". Volume, issue, article number and DOI belong in the BibTeX only, not in headings or citation lines (owner, 2026-11-10). Rebuilt with pdflatex (five pages, no errors), checked page 2 by eye and copied it to both public paths.
- `tools/verify/verify.sh` on dl41 showed exactly these content diffs; re-captured with `--accept`, then ALL OK.
- The project page (`/misc/dl00/halo/Hexa-P/Hexa-P-Page`) got a Springer button (DOI), the accepted-manuscript notice and volume, issue, article number and DOI in its BibTeX; its heading and citation line still read "Pattern Analysis and Applications, 2026".

## 2026-10-28 (baselines re-captured)

- `node` is at `/usr/bin/node` on dl41 and dl50 (not on dl40 or dl60). Ran `tools/verify/verify.sh` on dl41 over NFS.
- Before re-capturing, JavaScript syntax, JSON-LD, tag balance and local assets passed on both pages. The content diffs against the old baselines were exactly the four unverified changes above: the Hexa-P "Code" link, the two internship mentors with their links, the bio and RIPL links, and the removal of the home domestic-presentations tile with Experience moved before Awards (sections renumbered, the `publications.html#domestic` link gone from the home page).
- Checked the home page by eye in Playwright's headless Chromium (`~/.cache/ms-playwright/chromium_headless_shell-1243`) at 1280 px in English and Japanese. The language is set through `localStorage` `ht.lang` by a redirect page; `--lang=ja-JP` does not switch it. A 390 px capture with a 14000 px tall window stretched the hero to the window height, so the phone width was not checked.
- Re-captured the baselines with `verify.sh --accept`; the next run printed ALL OK.

## 2026-10-28 (bio and TTIC links)

- `ref()` in `static/js/tpl.js` now takes a per-language `href` ({en, ja}), as it already did for `label`.
- Linked the bio to Toyota Technological Institute (en https://www.toyota-ti.ac.jp/english/, ja https://www.toyota-ti.ac.jp/), the Intelligent Information Media Lab (en https://www.toyota-ti.ac.jp/Lab/Denshi/iim/, ja .../iim/index-j.html) and Prof. Norimichi Ukita (en .../iim/ukita/, ja .../iim/ukita/index-j.html). On the lab and Ukita pages the bare URL is the English page and `index-j.html` the Japanese one. The TTI English URL is the one the official top page's "EN" button points to; from this cluster it answered with a 302 to the Japanese top page.
- Linked Prof. Matthew R. Walter in the TTIC Experience entry to RIPL (https://ttic.edu/ripl/).
- `tools/verify/verify.sh` was not run, because no host had `node`.

## 2026-10-28 (internship mentors)

- Added the internship mentors to the Experience entries, in the style of the TTIC entry: Igor Vasiljevic (https://ivasiljevic.github.io/, a Toyota Research Institute scientist on secondment to Woven by Toyota) for the Woven by Toyota internship, and Yoshihiro Ohama / 大濱 吉紘 (researchmap https://researchmap.jp/read0199462) for the Toyota Central R&D Labs. internship. The Japanese page reads "メンター: … 氏". `tools/verify/verify.sh` was not run, because no host had `node`; the content baselines are not updated.
- Added "Advisor: Dr. Igor Vasiljevic" to the Woven by Toyota entry of the CV source, as the Toyota Central R&D entry already names Dr. Yoshihiro Ohama. Rebuilt the CV with pdflatex (five pages, no errors), checked page 1 by eye and copied it to both public paths.
- Pushed together with the Hexa-P code link at the user's request.

## 2026-10-28 (Hexa-P code link)

- Added a "Code" link to https://github.com/ImIntheMiddle/Hexa-P to the Hexa-P entry, between PDF and Weights, as in the EmLoco entry. The repository is still private, so this commit is not pushed until the repository is public. `tools/verify/verify.sh` was not run, because no host had `node`.

## 2026-10-28 (icon, notice, bio)

- Added the X profile image of @ImlntheMiddle (fetched through unavatar.io, 400x400) as the site icon: `favicon.ico` at the root (48, 32, 16 px), `static/img/icon/icon-192.png` and `static/img/icon/apple-touch-icon.png` (180 px), linked from the head of both pages. Google shows a favicon in search results only after it recrawls the site.
- Shortened the Hexa-P accepted-manuscript notice to its first sentence, the wording Springer Nature asks for, and dropped the sentence that promised a link to the Version of Record.
- Dropped 「こんにちは！👋」 from the Japanese bio, which now opens with the programme and the lab (yomiyasu check run 20261028T011222Z-eb360ccd). The English bio still opens with "Hi! 👋".

These changes are verified (`tools/verify/verify.sh` passes) and pushed to main with the owner's approval.

## 2026-10-28 (publications page)

Split the publication lists into selected papers on the home page and a full list on a new page, and pointed the Hexa-P news link at its project page.

- The data, the stylesheet and the shared templates moved out of `index.html` into `static/js/data.js`, `static/css/site.css`, `static/js/tpl.js`, `static/js/boot.js` and `static/js/ui.js`, so both pages read one copy. The split alone left the rendered text, links and sections identical to the baseline.
- Every publication and domestic talk has a `date` (year / month from `MyCV/main.tex`), and every list is shown newest first.
- The home page shows the entries marked `selected`: Hexa-P (PAA 2026), PRISM and Energy-Regularized Imitation Learning (ECCV 2026 workshops), MMCM (WACV 2026), the MVA 2025 multi-person pose evaluation paper, EmLoco (CVPR 2025) and VATL4Pose (WACV 2024). Of the domestic talks it shows only the 2026 / 03 IPSJ CVIM talk, with "Encouragement Award / 奨励賞" as a badge. Each tile shows its counts (12 papers, 5 as first author; 9 talks in Japan, 4 as first author) and links to the full list.
- `publications.html` lists all 12 papers and all 9 domestic talks by year, links to Google Scholar and back to the home page, and has no plaza simulation.
- The October 2026 news item now links the Hexa-P title to https://iminthemiddle.github.io/Hexa-P-Page/ instead of the accepted-manuscript PDF.
- `tools/verify/verify.sh` now checks both pages; baselines for `publications.html` are prefixed `publications.`. Checked both pages in headless Chromium at 1280 px (English) and 390 px (Japanese).

- `publications.html` scrolls to the fragment (`#domestic`) itself after building the lists. Headless Chromium paints a blank frame once the page is scrolled, so the jump is not yet checked in a real browser.
- Started two local servers for the screenshots, `python3 -m http.server` on ports 8765 (PID 2669387) and 8766 (PID 3424770); both were stopped after the owner approved.

- Owner's decisions: the home domestic tile shows only the counts (the Encouragement Award badge is on publications.html), and the paper count stays at 12, SNL posters and the arXiv preprint included.
- Revised the Japanese text of the page with the yomiyasu skill (check run 20261028T005658Z-6046681f, records in the git-excluded `.yomiyasu/`): news items now end in full sentences (「〜されました」「〜しました」) instead of noun endings and drop 「にて」; the bio reads 「研究しています」; the award and funding notes, the Hexa-P and VATL4Pose image descriptions and the footer were reworded. Proper names, award names, paper and talk titles, media titles and the emoji, which the English text shares, were kept. English text and links are unchanged.

Committed and pushed to main with the owner's approval.

## 2026-10-28

Linked the Hexa-P entry to its project page and weights, and gave it a looping thumbnail.

- The Hexa-P title now links to the project page https://iminthemiddle.github.io/Hexa-P-Page/ (`project` field), and a "Weights" link points to https://huggingface.co/ImIntheMiddle/Hexa-P.
- The thumbnail `static/img/pub/hexap.mp4` is the first 4 s of the overview clip of the project page (`static/results/pretraining/overview.mp4`, simulated humanoids walking random paths in IsaacGym), cropped to the 640x400 region at (640, 520), scaled to 336x210 and played at 15 fps. Its first frame at 672x420 is the poster `static/img/pub/hexap@2x.webp`.
- Updated the content baselines; the only differences were the two new links.

## 2026-10-27

Published the accepted manuscript of "Hexa-P: Physical Plausibility-aware Pre-training for Pedestrian Path Prediction" (Pattern Analysis and Applications) on the homepage.

- Added the unmodified accepted manuscript as `static/uploads/Hexa-P_PAA_2026_accepted_manuscript.pdf` and linked it from the journal publication entry.
- Added an optional `note` field to publication entries and used it for the accepted-manuscript notice that Springer Nature's self-archiving policy asks for. Springer journals allow the accepted manuscript on a personal website immediately on acceptance.
- Updated the content baselines; the only differences were the new PDF link and the notice.
- Merged the SNL 2026 poster entry for Hexa-P into the journal entry, which now reads "accepted · also a poster at SNL 2026". The news item for the SNL 2026 posters is unchanged.
- Replaced the WACV 2024 (VATL4Pose) thumbnail with a looping clip from the VATL4Pose project page: the adapted half of `static/results/pt21_018903/side.mp4` there (PoseTrack21 018903, the first clip of the page's before/after slider), cropped to 16:10 and scaled to 336x210 as `static/img/pub/vatl4pose.mp4`. Its first frame is the poster `static/img/pub/vatl4pose@2x.webp`; the 1x image is removed. `media()` now renders an `image` with a `video` field as a muted looping `<video>`.
- Added an optional `project` field to publication entries, which makes the title a link to the project page, and moved the EmLoco and VATL4Pose project pages from the "Project" link under the title to the title itself.
- Linked the MMCM title to its project page on the Ukita lab site. Titles that link to a project page now carry an accent-coloured underline.
- Linked the news items to related pages: the Hexa-P accepted manuscript and the journal home page, Woven by Toyota, ACCV 2026, SNL 2026, the TTI news posts on the two awards, the EmLoco project page and the Toyoaki Scholarship Foundation. The TTI Ph.D. scholarship and the personal news item have no link. The rendered text is unchanged.

Next: when the DOI is issued, add the publisher link and change the last sentence of the notice to "The Version of Record is available online at: https://doi.org/<DOI>".

## 2026-10-26

Added the acceptance of "Hexa-P: Physical Plausibility-aware Pre-training for Pedestrian Path Prediction" by Pattern Analysis and Applications, as reported by Hiromu Taketsugu.

- Added English and Japanese news for October 2026 and a journal publication entry marked accepted. Kept the existing SNL 2026 poster record.
- Added the accepted journal paper to the CV source and rebuilt both public PDF copies from that source.
- Updated the English and Japanese content baselines after checking that all prior page content remained unchanged.
- The existing page verification passed, including JavaScript syntax, structured metadata, HTML tag balance, local assets, and rendered content baselines.
- LaTeX compilation completed and produced a five-page CV. The acceptance entry and final page were visually checked. Existing font-package and layout warnings remain in unrelated CV entries.
- The Japanese prose check reported warnings only in existing page content.

Next: add the publisher link and final bibliographic details when they are available.
