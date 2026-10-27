# Progress

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
