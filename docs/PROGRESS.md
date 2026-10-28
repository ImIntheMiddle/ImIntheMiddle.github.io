# Progress

## 2026-10-28 (internship mentors)

- Added the internship mentors to the Experience entries, in the style of the TTIC entry: Igor Vasiljevic (https://ivasiljevic.github.io/, a Toyota Research Institute scientist on secondment to Woven by Toyota) for the Woven by Toyota internship, and Yoshihiro Ohama / 大濱 吉紘 (researchmap https://researchmap.jp/read0199462) for the Toyota Central R&D Labs. internship. The Japanese page reads "メンター: … 氏". `tools/verify/verify.sh` was not run, because no host had `node`; the content baselines are not updated. Not pushed, since it sits on top of the unpushed Hexa-P code link.

## 2026-10-28 (Hexa-P code link)

- Added a "Code" link to https://github.com/ImIntheMiddle/Hexa-P to the Hexa-P entry, between PDF and Weights, as in the EmLoco entry. The repository is still private, so this commit is not pushed until the repository is public. `tools/verify/verify.sh` was not run, because no host had `node`.

## 2026-10-28 (icon, notice, bio)

- Added the X profile image of @ImlntheMiddle (fetched through unavatar.io, 400x400) as the site icon: `favicon.ico` at the root (48, 32, 16 px), `static/img/icon/icon-192.png` and `static/img/icon/apple-touch-icon.png` (180 px), linked from the head of both pages. Google shows a favicon in search results only after it recrawls the site.
- Shortened the Hexa-P accepted-manuscript notice to its first sentence, the wording Springer Nature asks for, and dropped the sentence that promised a link to the Version of Record.
- Dropped 「こんにちは！👋」 from the Japanese bio, which now opens with the programme and the lab (yomiyasu check run 20261028T011222Z-eb360ccd). The English bio still opens with "Hi! 👋".

These changes are verified (`tools/verify/verify.sh` passes) and pushed to main with the owner's approval.

Next: when the DOI is issued, add the publisher link and append "The Version of Record is available online at: https://doi.org/<DOI>" to the notice.

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
