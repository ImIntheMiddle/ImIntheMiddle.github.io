/* ====================================================================
   @@DATA@@ — page content.
   Edit this and nothing else to change what the page says. A field is either
   a plain string (language-neutral: titles, authors, venues, URLs) or an
   {en, ja} pair. Inline links use a {token} that resolves against the
   entry's `refs`, so a URL is written exactly once for both languages.
   Emphasis inside a translated string uses *em* and **strong**.
   ==================================================================== */
const DATA = {
  news: [
    { date: '2026 / 10', tag: 'JOURNAL',
      text: { en: 'Our paper, "{paper}", has been accepted for publication in {journal}.',
              ja: '{paper}が{journal}に採択されました' },
      refs: { paper: { href: 'https://iminthemiddle.github.io/Hexa-P-Page/',
                       label: { en: 'Hexa-P: Physical Plausibility-aware Pre-training for Pedestrian Path Prediction', ja: 'Hexa-P' } },
              journal: { href: 'https://link.springer.com/journal/10044', label: 'Pattern Analysis and Applications' } } },

    { date: '2026 / 09', tag: 'FUNDING',
      text: { en: "Selected for the special grant of TTI's Ph.D. Program Scholarship 🎓",
              ja: '豊田工業大学 博士後期課程奨学金の「特別給付」に選ばれました 🎓' } },

    { date: '2026 / 08', tag: 'INTERN',
      text: { en: 'Completed an internship at {woven} 🚗',
              ja: '{woven} でのインターンを終えました 🚗' },
      refs: { woven: { href: 'https://woven.toyota/', label: 'Woven by Toyota' } } },

    { date: '2026 / 07', tag: 'WORKSHOP',
      text: { en: 'Our workshop proposal, {w}, was accepted at {accv} 🎉',
              ja: '提案したワークショップ {w} が {accv} に採択されました 🎉' },
      refs: { w: { href: 'https://hufpei-workshop.github.io/accv2026/', label: 'HUFPEI Workshop' },
              accv: { href: 'https://accv2026.org/', label: 'ACCV 2026' } } },

    { date: '2026 / 06', tag: 'SNL',
      text: { en: 'Presented two posters at {snl}, TTIC: Hexa-P and Re-EmLoco 🪧',
              ja: '{snl}（TTIC）で Hexa-P と Re-EmLoco の2件をポスター発表しました 🪧' },
      refs: { snl: { href: 'https://snl2026.ttic.edu/', label: 'SNL 2026' } } },

    { date: '2026 / 05', tag: 'AWARD',
      text: { en: 'Received the {award} for {emloco} 🏆',
              ja: '{emloco} で {award}を受賞しました 🏆' },
      refs: { award: { href: 'https://www.toyota-ti.ac.jp/news/checktti/002900.html',
                       label: { en: '2026 IEEE Nagoya Section International Conference Research Presentation Award',
                                ja: '2026年 IEEE名古屋支部 国際会議研究発表賞' } },
              emloco: { href: 'https://iminthemiddle.github.io/EmLoco-Page/', label: 'EmLoco' } } },

    { date: '2026 / 04', tag: 'FUNDING',
      text: { en: 'Selected as a {toyoaki} scholar 🎓',
              ja: '{toyoaki}の奨学生に採用されました 🎓' },
      refs: { toyoaki: { href: 'https://toyoaki.jp/', label: { en: 'Toyoaki Scholarship Foundation', ja: '豊秋奨学会' } } } },

    { date: '2026 / 03', tag: 'AWARD',
      text: { en: 'Received the {award} for Hexa-P 🏆',
              ja: 'Hexa-P で {award}を受賞しました 🏆' },
      refs: { award: { href: 'https://www.toyota-ti.ac.jp/news/checktti/002899.html',
                       label: { en: 'Encouragement Award at the 245th IPSJ CVIM meeting',
                                ja: '第245回 情報処理学会 CVIM研究会 奨励賞' } } } },

    { date: '2025 / 08', tag: 'SERVICE',
      text: { en: 'Appointed Technical Chair for {accv} 🛠️',
              ja: '{accv} の Technical Chair に就任しました 🛠️' },
      refs: { accv: { href: 'https://accv2026.org/', label: 'ACCV 2026' } } },

    { date: "2025 / 02", tag: "CVPR'25",
      text: { en: '{emloco} accepted to CVPR 2025 🎉 — {arxiv}',
              ja: '{emloco} が CVPR 2025 に採択されました 🎉（{arxiv}）' },
      refs: { emloco: { href: 'https://iminthemiddle.github.io/EmLoco-Page/', label: 'EmLoco' },
              arxiv: { href: 'https://arxiv.org/abs/2503.17267', label: 'arXiv' } } },

    { date: '2025 / 01', tag: 'LIFE',
      text: { en: 'Became a father 👶', ja: '父になりました 👶' } }
  ],

  /* Titles, authors, venues and URLs are the same in both languages, so a
     publication carries no translated fields at all. `me` is matched against
     `authors` to bold the right name, and a list's first author decides the
     first-author count above it. `date` is the year and month of the venue;
     every list is shown newest first, and entries of the same month keep
     their order here. `selected` puts an entry on the home page as well as
     on publications.html, which lists everything. `rate`, `titleNote`, `thumbFile`,
     `image`, `project` and `note` are all optional — leave one out and its
     markup is not emitted. `project` turns the title into a link to the
     project page. An `image` with `video` plays that clip on a loop and shows
     `src` until it starts. */
  me: 'H. Taketsugu',
  publications: [
    /* First-author work first, then co-authored. */
    { date: '2026 / 10', selected: true,
      venue: '**Pattern Analysis and Applications** 2026', rate: 'accepted · also a poster at SNL 2026',
      title: 'Hexa-P: Physical Plausibility-aware Pre-training for Pedestrian Path Prediction',
      project: 'https://iminthemiddle.github.io/Hexa-P-Page/',
      authors: ['H. Taketsugu', 'S. Nobuhara', 'N. Ukita'],
      image: { video: 'static/img/pub/hexap.mp4', src: 'static/img/pub/hexap@2x.webp', w: 336, h: 210,
               alt: { en: 'Simulated humanoids walking random paths in the physics pre-training of Hexa-P', ja: 'Hexa-P の事前学習で、物理シミュレーションの中をランダムな経路で歩く人体モデル' } },
      links: [
        { label: 'PDF', href: 'static/uploads/Hexa-P_PAA_2026_accepted_manuscript.pdf', newTab: true },
        { label: 'Code', href: 'https://github.com/ImIntheMiddle/Hexa-P' },
        { label: 'Weights', href: 'https://huggingface.co/ImIntheMiddle/Hexa-P' }
      ],
      note: "This version of the article has been accepted for publication, after peer review and is subject to Springer Nature's AM terms of use, but is not the Version of Record and does not reflect post-acceptance improvements, or any corrections." },

    { date: '2026 / 06',
      venue: 'SNL 2026', rate: 'poster',
      title: 'Re-EmLoco: Recovering Embodied Locomotion for Degradation-Robust Pedestrian Path Prediction',
      authors: ['H. Taketsugu', 'S. Nobuhara', 'N. Ukita'],
      links: [] },

    { date: '2025 / 06', selected: true,
      venue: '**CVPR 2025**', rate: 'poster · 22.1% accept',
      title: 'Physical Plausibility-aware Trajectory Prediction via Locomotion Embodiment',
      project: 'https://iminthemiddle.github.io/EmLoco-Page/',
      authors: ['H. Taketsugu', 'T. Oba', 'T. Maeda', 'S. Nobuhara', 'N. Ukita'],
      image: { src: 'static/img/pub/emloco.webp', src2x: 'static/img/pub/emloco@2x.webp', w: 336, h: 210,
               alt: { en: 'EmLoco teaser figure', ja: 'EmLoco のティザー図' } },
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2503.17267' },
        { label: 'Code', href: 'https://github.com/ImIntheMiddle/EmLoco' },
        { label: 'Video', href: 'https://youtu.be/OYLDYinc9DU' },
        { label: 'Weights', href: 'https://huggingface.co/iminthemiddle/EmLoco' }
      ] },

    { date: '2024 / 01', selected: true,
      venue: '**WACV 2024**', rate: 'poster · 41% accept',
      title: 'Active Transfer Learning for Efficient Video-Specific Human Pose Estimation',
      project: 'https://iminthemiddle.github.io/VATL4Pose-Page/',
      authors: ['H. Taketsugu', 'N. Ukita'],
      image: { video: 'static/img/pub/vatl4pose.mp4', src: 'static/img/pub/vatl4pose@2x.webp', w: 336, h: 210,
               alt: { en: 'Poses estimated in a video after adaptation with VATL4Pose', ja: 'VATL4Pose で適応させたあとに動画から推定した姿勢' } },
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2311.05041' },
        { label: 'Code', href: 'https://github.com/ImIntheMiddle/VATL4Pose-WACV2024' }
      ] },

    { date: '2023 / 08',
      venue: 'MVA 2023', rate: '**Oral**',
      title: 'Uncertainty Criteria in Active Transfer Learning for Efficient Video-Specific Human Pose Estimation',
      authors: ['H. Taketsugu', 'N. Ukita'],
      links: [ { label: 'IEEE', href: 'https://ieeexplore.ieee.org/abstract/document/10215565' } ] },

    { date: '2026 / 09', selected: true,
      venue: 'ECCV 2026 Workshop', rate: 'Agent in World · co-author',
      title: 'PRISM: Predictive Representation of Interaction Style and Motion for Social Robot Navigation',
      authors: ['B.-H. Chen', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/prism.webp', src2x: 'static/img/pub/prism@2x.webp', w: 336, h: 210,
               alt: { en: 'PRISM teaser figure', ja: 'PRISM のティザー図' } },
      links: [ { label: 'arXiv', href: 'https://arxiv.org/abs/2609.18125' } ] },

    { date: '2026 / 09', selected: true,
      venue: 'ECCV 2026 Workshop', rate: 'FCAM · co-author',
      title: 'Energy-Regularized Imitation Learning for Force- and Work-Aware Robotic Manipulation',
      authors: ['T. Otani', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/energyil.webp', src2x: 'static/img/pub/energyil@2x.webp', w: 336, h: 210,
               alt: { en: 'An efficient and a redundant manipulation trajectory', ja: '効率的な軌道と冗長な軌道の比較' } },
      links: [ { label: 'arXiv', href: 'https://arxiv.org/abs/2609.18164' } ] },

    { date: '2026 / 03', selected: true,
      venue: '**WACV 2026**', rate: 'co-author',
      title: 'MMCM: Multimodality-aware Metric using Clustering-based Modes for Probabilistic Human Motion Prediction',
      project: 'https://www.toyota-ti.ac.jp/Lab/Denshi/iim/ukita/selection/WACV2026.html',
      authors: ['K. Tokoro', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/mmcm.webp', src2x: 'static/img/pub/mmcm@2x.webp', w: 336, h: 210,
               alt: { en: 'MMCM teaser figure', ja: 'MMCM のティザー図' } },
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2511.15179' },
        { label: 'PDF', href: 'https://openaccess.thecvf.com/content/WACV2026/papers/Tokoro_MMCM_Multimodality-aware_Metric_using_Clustering-based_Modes_for_Probabilistic_Human_Motion_WACV_2026_paper.pdf' }
      ] },

    { date: '2025 / 10',
      venue: 'SNL 2025', rate: 'co-author',
      title: 'Hierarchical Group-aware Token Merging for Efficient Trajectory Prediction',
      authors: ['Y. Yoshida', 'N. Ukita', 'H. Taketsugu'],
      links: [] },

    { date: '2025 / 07', selected: true,
      venue: 'MVA 2025', rate: '**Best Poster Award** · co-author',
      title: 'Multi-Person Pose Estimation Evaluation Using Optimal Transportation and Improved Pose Matching',
      authors: ['T. Moriki', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/mva25.webp', src2x: 'static/img/pub/mva25@2x.webp', w: 336, h: 210,
               alt: { en: 'Estimated poses of two people, compared', ja: '2人の推定姿勢の比較' } },
      links: [ { label: 'arXiv', href: 'https://arxiv.org/abs/2603.10398' } ] },

    { date: '2025 / 07',
      venue: 'MIRU 2025', rate: 'co-author',
      title: 'Selective Social-Interaction via Individual Importance for Fast Human Trajectory Prediction',
      authors: ['Y. Urano', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/miru25.webp', src2x: 'static/img/pub/miru25@2x.webp', w: 336, h: 210,
               alt: { en: 'Trajectory prediction with and without the importance estimator', ja: '重要度推定の有無による軌跡予測の比較' } },
      links: [ { label: 'arXiv', href: 'https://arxiv.org/abs/2506.18291' } ] },

    { date: '2025 / 04',
      venue: 'arXiv preprint', rate: 'co-author',
      title: 'Human Motion Prediction via Test-domain-aware Adaptation with Easily-available Human Motions Estimated from Videos',
      authors: ['K. Shimbo', 'H. Taketsugu', 'N. Ukita'],
      image: { src: 'static/img/pub/hmpadapt.webp', src2x: 'static/img/pub/hmpadapt@2x.webp', w: 336, h: 210,
               alt: { en: 'The data used by the proposed and existing methods', ja: '提案手法と既存手法が使うデータ' } },
      links: [ { label: 'arXiv', href: 'https://arxiv.org/abs/2505.07301' } ] }
  ],

  /* Talks at meetings in Japan, titles as given there: first-author work
     first, then co-authored. `me` is the name to bold; `date` and `rate`
     work as for the publications, and the date is shown. The home page
     shows only the counts; publications.html lists every talk. */
  domesticMe: '武次 広夢',
  domestic: [
    { date: '2026 / 03', venue: 'IPSJ CVIM',
      rate: { en: '**Encouragement Award**', ja: '**奨励賞**' },
      title: '物理シミュレーションに基づく大規模事前学習による物理的妥当性を備えた歩行者軌跡予測',
      authors: ['武次 広夢', '延原 章平', '浮田 宗伯'], links: [] },
    { date: '2024 / 11', venue: 'IPSJ CVIM',
      title: '身体化歩行動作と整合する歩行軌跡の学習安定化',
      authors: ['武次 広夢', '延原 章平', '浮田 宗伯'], links: [] },
    { date: '2024 / 05', venue: 'IEICE PRMU',
      title: '物理シミュレータを用いた姿勢整合損失による人軌跡予測',
      authors: ['武次 広夢', '延原 章平', '浮田 宗伯'], links: [] },
    { date: '2023 / 05', venue: 'IPSJ CVIM',
      title: '効率的な動画別の人体姿勢推定を目的とした能動転移学習の不確実性基準',
      authors: ['武次 広夢', '浮田 宗伯'], links: [] },

    { date: '2026 / 09', venue: '知能メカトロニクスWS',
      title: 'エネルギー予測器によるロボット動作のエネルギー効率向上',
      authors: ['大谷 知暉', '武次 広夢', '浮田 宗伯'], links: [] },
    { date: '2026 / 05', venue: 'IPSJ CVIM',
      title: '3次元人体構造と局所画像特徴の適応的統合による画像内外に対応した2次元人体姿勢推定',
      authors: ['森木 勇登', '武次 広夢', '浮田 宗伯'], links: [] },
    { date: '2026 / 05', venue: 'IPSJ CVIM',
      title: '階層的なグループ構造を用いたトークンの統合による効率的な軌跡予測',
      authors: ['吉田 有輝', '武次 広夢', '浮田 宗伯'], links: [] },
    { date: '2025 / 05', venue: 'IPSJ CVIM',
      title: '最適輸送と領域分割を用いた複数人姿勢推定の評価指標の提案',
      authors: ['森木 勇登', '前田 孝泰', '武次 広夢', '大羽 剛瑠', '浮田 宗伯'], links: [] },
    { date: '2024 / 05', venue: 'IPSJ CVIM',
      title: '行動ラベルを用いた対照学習におけるアンカーの密度ベース選択による人間軌跡予測',
      authors: ['浦野 耀太', '武次 広夢', '前田 孝泰', '浮田 宗伯'], links: [] }
  ],

  /* The hero chips, and nothing else. */
  links: [
    { label: 'Email', href: 'mailto:sd25502@toyota-ti.ac.jp', primary: true },
    { label: 'Scholar',
      href: 'https://scholar.google.co.jp/citations?user=HkFAVbcAAAAJ' },
    { label: 'CV', href: 'static/uploads/CV_Hiromu_Taketsugu.pdf', newTab: true },
    { label: 'GitHub', href: 'https://github.com/ImIntheMiddle' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ImIntheMiddle/' },
    { label: 'X', href: 'https://twitter.com/ImlntheMiddle' }
  ],

  about: {
    portrait: { src: 'static/img/avatar.webp', src2x: 'static/img/avatar@2x.webp', w: 280, h: 280,
                alt: { en: 'Hiromu Taketsugu', ja: '武次 広夢' } },
    paras: [
      { en: 'Hi! 👋 I am a Ph.D. student (D2) at **{tti}**, advised by Prof. {ukita} in the {iim}. My research interests are **Physical AI** and **human motion estimation and prediction**.',
        ja: '{tti}の博士後期課程（D2）に在籍し、{iim}で**{ukita}**教授の指導のもと研究しています。**Physical AI** と**人の動きの推定・予測**に興味があります。',
        refs: {
          tti: { href: { en: 'https://www.toyota-ti.ac.jp/english/', ja: 'https://www.toyota-ti.ac.jp/' },
                 label: { en: 'Toyota Technological Institute', ja: '豊田工業大学' } },
          iim: { href: { en: 'https://www.toyota-ti.ac.jp/Lab/Denshi/iim/',
                         ja: 'https://www.toyota-ti.ac.jp/Lab/Denshi/iim/index-j.html' },
                 label: { en: 'Intelligent Information Media Lab', ja: '知能情報メディア研究室' } },
          ukita: { href: { en: 'https://www.toyota-ti.ac.jp/Lab/Denshi/iim/ukita/',
                           ja: 'https://www.toyota-ti.ac.jp/Lab/Denshi/iim/ukita/index-j.html' },
                   label: { en: 'Norimichi Ukita', ja: '浮田宗伯' } } } }
    ]
  },

  awards: [
    { year: '2026',
      name: { en: 'IEEE Nagoya Section International Conference Research Presentation Award',
              ja: 'IEEE名古屋支部 国際会議研究発表賞' },
      org: { en: 'For EmLoco (CVPR 2025)', ja: 'EmLoco（CVPR 2025）の発表に対して' } },
    { year: '2026',
      name: { en: 'Encouragement Award — 245th IPSJ CVIM Meeting', ja: '奨励賞 — 第245回 情報処理学会 CVIM研究会' },
      org: { en: 'For Hexa-P · one per meeting, by attendee vote',
             ja: 'Hexa-P の発表に対して · 参加者の投票で各回1件を選出' } },
    { year: '2025',
      name: { en: 'Presentation Award — 15th Exchange Meeting between Companies and Ph.D. Talent',
              ja: 'プレゼン賞 — 第15回 企業と博士人材の交流会' },
      org: { en: 'Nagoya University · August 2025', ja: '名古屋大学 · 2025年8月' } },
    { year: '2025',
      name: 'Best Poster Award — MVA 2025',
      org: { en: 'Co-author · Multi-Person Pose Estimation Evaluation',
             ja: '共著 · 多人数の姿勢推定の新しい評価指標' } },
    { year: '2025',
      name: { en: 'Poster Award (3rd place)', ja: 'ポスター賞（第3位）' },
      org: { en: 'JST ASPIRE Kyoto Workshop · 3rd of 48 posters',
             ja: 'JST ASPIRE 京都ワークショップ · 48件中3位' } },
    { year: '2023',
      name: { en: 'Toyoda Foundation Scholarship Award', ja: '豊田奨学基金賞' },
      org: { en: 'Toyota Technological Institute · sole undergraduate recipient, for grades and character',
             ja: '豊田工業大学 · 学業成績・人物ともに特に優秀な学生として学部から1名' } },
    { year: '2023',
      name: { en: 'Outstanding Student Award', ja: '優秀学生賞' },
      org: { en: 'The Society of Instrument and Control Engineers (SICE)',
             ja: '計測自動制御学会 (SICE)' } },
    { year: '2023',
      name: { en: 'English Excellence Award (2nd place)', ja: '英語優秀賞（2位）' },
      org: { en: 'Toyota Technological Institute · English Step-Up points at graduation',
             ja: '豊田工業大学 · 卒業時の英語 Step-Up Point' } },
    { year: '2022',
      name: { en: "Outstanding Presentation Award — Bachelor's Thesis", ja: '卒業研究 優秀発表賞' },
      org: { en: 'Toyota Technological Institute · June 2022', ja: '豊田工業大学 · 2022年6月' } },
    { year: '2022',
      name: { en: 'Outstanding Graduate — top 1% of the cohort',
              ja: '優秀修了生 — 修了生の上位1%' },
      org: { en: 'Global Consumer Intelligence (GCI) 2021 Winter · The University of Tokyo',
             ja: 'グローバル消費インテリジェンス寄附講座 (GCI) 2021 Winter · 東京大学' } },
    { year: '2021',
      name: { en: '1st place — Advanced Technology Development', ja: '技術開発特論 1位' },
      org: { en: 'Toyota Technological Institute · December 2021', ja: '豊田工業大学 · 2021年12月' } },
    { year: '2021',
      name: { en: '1st place, free-theme division — English Science and Technology Presentation Contest',
              ja: '自由テーマ部門 優勝 — 英語科学技術プレゼンテーションコンテスト' },
      org: { en: 'Toyota Technological Institute · November 2021', ja: '豊田工業大学 · 2021年11月' } }
  ],

  /* Scholarships, fellowships and travel grants, kept apart from the
     awards as the CV keeps them. */
  funding: [
    { year: '2026',
      name: { en: 'Ph.D. Program Scholarship — Special Grant', ja: '博士後期課程奨学金「特別給付」' },
      org: { en: 'Toyota Technological Institute · September 2026', ja: '豊田工業大学 · 2026年9月' } },
    { year: '2026 –',
      name: { en: 'Toyoaki Scholarship', ja: '豊秋奨学会 奨学生' },
      org: { en: 'Toyoaki Scholarship Foundation · grant scholarship',
             ja: '公益財団法人 豊秋奨学会 · 給付型' } },
    { year: '2025',
      name: { en: 'Travel Grant — CVPR 2025', ja: '研究者海外派遣助成 — CVPR 2025' },
      org: { en: 'International Information Science Foundation (IISF)',
             ja: '公益財団法人 情報科学国際交流財団' } },
    { year: '2025 –',
      name: { en: 'JSPS Research Fellowship for Young Scientists (DC1)',
              ja: '日本学術振興会 特別研究員 (DC1)' },
      org: { en: 'Japan Society for the Promotion of Science · ~14% acceptance',
             ja: '採用率 約14%' } },
    { year: '2025 –',
      name: { en: 'Ph.D. Program Scholarship', ja: '博士後期課程奨学金' },
      org: { en: 'Toyota Technological Institute · full tuition and admission fee',
             ja: '豊田工業大学 · 授業料・入学金の全額' } },
    { year: '2024',
      name: { en: 'Travel Grant — WACV 2024', ja: '国際会議論文発表者助成 — WACV 2024' },
      org: { en: 'NEC C&C Foundation', ja: '公益財団法人 NEC C&C財団' } },
    { year: '2023',
      name: { en: 'Tatsuro Toyoda Foundation Scholarship', ja: '豊田達郎奨学基金 奨学金' },
      org: { en: 'Toyota Technological Institute · travel and living costs for the TTIC exchange',
             ja: '豊田工業大学 · TTIC 協定留学の渡航費・滞在費' } },
    { year: '2023 –',
      name: { en: "Integrated Master's and Doctoral Program", ja: '修士・博士一貫教育プログラム' },
      org: { en: "Toyota Technological Institute · a few students a year · stipend through the master's",
             ja: '豊田工業大学 · 各学年若干名 · 修士課程の間に給付' } },
    { year: '2019 – 2023',
      name: { en: 'Toyoda Foundation Scholarship', ja: '豊田奨学基金 奨学金' },
      org: { en: "Toyota Technological Institute · tuition exemption through the bachelor's",
             ja: '豊田工業大学 · 学部4年間の授業料減免' } }
  ],

  /* Community roles and course work share one section: each is only a row or
     two on its own, and together they answer the same question. */
  service: [
    { year: '2026',
      name: { en: 'Technical Chair — ACCV 2026', ja: 'Technical Chair — ACCV 2026' },
      org: { en: 'Asian Conference on Computer Vision · Osaka, December 2026',
             ja: 'アジアコンピュータビジョン会議 · 大阪 · 2026年12月' } },
    { year: '2026',
      name: { en: 'Organizer — {w}', ja: 'オーガナイザー — {w}' },
      org: { en: 'International Workshop on Human Understanding, Future Prediction, and Embodied Intelligence · ACCV 2026',
             ja: 'International Workshop on Human Understanding, Future Prediction, and Embodied Intelligence · ACCV 2026' },
      refs: { w: { label: 'HUFPEI Workshop', href: 'https://hufpei-workshop.github.io/accv2026/' } } },
    { year: '2024 –',
      name: { en: 'Reviewer', ja: '査読者' },
      org: { en: 'T-PAMI · CVIU · CVPR 2024, 2025 · WACV 2026, 2027 · ECCV 2026 · NeurIPS 2026 · BMVC 2026',
             ja: 'T-PAMI · CVIU · CVPR 2024, 2025 · WACV 2026, 2027 · ECCV 2026 · NeurIPS 2026 · BMVC 2026' } },
    { year: '2023 –',
      name: { en: 'Teaching Assistant', ja: 'ティーチングアシスタント' },
      org: { en: 'Toyota Technological Institute · Face Recognition · AI & Deep Learning Experiments · Computer Graphics',
             ja: '豊田工業大学 · 顔認識 · 人工知能・深層学習実験 · コンピュータグラフィックス' } },
    { year: '2025',
      name: { en: 'Course material — {course}', ja: '実験教材 — {course}' },
      org: { en: 'Toyota Technological Institute · 2025 academic year',
             ja: '豊田工業大学 · 2025年度' },
      refs: { course: { href: 'https://github.com/ImIntheMiddle/TTI_AI-DL_2025',
                        label: 'Experiments in Artificial Intelligence & Deep Learning' } } },
    { year: '2024',
      name: { en: 'Course material — {course}', ja: '実験教材 — {course}' },
      org: { en: 'Toyota Technological Institute · 2024 academic year',
             ja: '豊田工業大学 · 2024年度' },
      refs: { course: { href: 'https://github.com/ImIntheMiddle/TTI_AI-DL_2024',
                        label: 'Experiments in Artificial Intelligence & Deep Learning' } } }
  ],

  /* Career and education: the two ongoing roles lead, then everything
     closed by start date, newest first. */
  timeline: [
    { year: '2025.04 –',
      name: { en: 'Ph.D. student, Information-Aided Technology',
              ja: '博士後期課程 — 情報援用工学専攻' },
      org: { en: 'Toyota Technological Institute · Intelligent Information Media Lab',
             ja: '豊田工業大学 · 知能情報メディア研究室' } },
    { year: '2025.04 –',
      name: { en: 'JSPS Research Fellow (DC1)', ja: '日本学術振興会 特別研究員 (DC1)' },
      org: { en: 'Japan Society for the Promotion of Science', ja: '日本学術振興会' } },
    { year: '2026.06 – 2026.08',
      name: { en: 'Intern — Machine Learning Engineer (Perception)',
              ja: 'インターン — Machine Learning Engineer (Perception)' },
      org: { en: 'Woven by Toyota · mentored by {igor}',
             ja: 'Woven by Toyota · メンター: {igor} 氏' },
      refs: { igor: { href: 'https://ivasiljevic.github.io/', label: 'Igor Vasiljevic' } } },
    { year: '2023.10 – 2024.09',
      name: { en: 'Science Writer', ja: 'サイエンスライター' },
      org: { en: 'AI-SCHOLAR · remote · explaining recent machine-learning papers',
             ja: 'AI-SCHOLAR · リモート · 最新の機械学習論文の解説記事を執筆' } },
    { year: '2023.09 – 2023.12',
      name: { en: 'Visiting Student', ja: '客員学生' },
      org: { en: 'Toyota Technological Institute at Chicago · with Prof. {walter}',
             ja: '豊田工業大学シカゴ校 (TTIC) · {walter} 教授' },
      refs: { walter: { href: 'https://ttic.edu/ripl/', label: 'Matthew R. Walter' } } },
    { year: '2023.04 – 2025.03',
      name: { en: 'M.Eng., Electronics and Information Engineering',
              ja: '修士課程 — 先端工学専攻 電子情報分野' },
      org: { en: 'Toyota Technological Institute · ranked 2nd of 50',
             ja: '豊田工業大学 · 修了時成績 50名中2位' } },
    { year: '2022.04 – 2025.03',
      name: { en: 'Teaching Assistant — Global Consumer Intelligence (GCI)',
              ja: 'ティーチングアシスタント — グローバル消費インテリジェンス (GCI)' },
      org: { en: 'The University of Tokyo · remote · 30,000+ students per term',
             ja: '東京大学 · リモート · 1学期あたり3万人超が受講' } },
    { year: '2022.01 – 2022.03',
      name: { en: 'Research Intern', ja: '研究インターン' },
      org: { en: 'Toyota Central R&D Labs., Inc. · mentored by {ohama}',
             ja: '株式会社 豊田中央研究所 · メンター: {ohama} 氏' },
      refs: { ohama: { href: 'https://researchmap.jp/read0199462',
                       label: { en: 'Yoshihiro Ohama', ja: '大濱 吉紘' } } } },
    { year: '2019.04 – 2023.03',
      name: { en: 'B.Eng., Electronics and Information Engineering',
              ja: '学士課程 — 先端工学基礎学科 電子情報分野' },
      org: { en: 'Toyota Technological Institute · ranked 1st of 83 · minor in Mechanical Engineering',
             ja: '豊田工業大学 · 卒業時成績 83名中1位 · 副専攻 機械システム分野' } }
  ],

  /* An empty array hides the whole section and its nav link, and renumbers
     the ones that remain. Invited talks only; conference presentations of the
     papers above are not repeated here. */
  talks: [
    { venue: { en: 'MIRU 2025 · Invited Talk', ja: 'MIRU 2025 · 招待講演' },
      title: 'Physical Plausibility-aware Trajectory Prediction via Locomotion Embodiment',
      note: { en: 'The 28th Meeting on Image Recognition and Understanding · July 2025',
              ja: '第28回 画像の認識・理解シンポジウム · 2025年7月' } },
    { venue: { en: 'Toyota Frontier Research Center · Talk',
               ja: 'トヨタ自動車 未来創生センター · 講演' },
      title: 'Human Trajectory Prediction for Social Navigation',
      note: { en: 'Tech meetup · May 2024', ja: '技術交流会 · 2024年5月' } },
    { venue: { en: 'NTT Atsugi R&D Center · Talk',
               ja: 'NTT 厚木研究開発センタ · 講演' },
      title: 'Computer Vision for Social Navigation',
      note: { en: 'NTT, Inc. · May 2024', ja: '日本電信電話株式会社 · 2024年5月' } }
  ],
  media: [
    { title: { en: 'Doctoral student Hiromu Taketsugu receives the IEEE Nagoya Section International Conference Research Presentation Award',
               ja: '【学生受賞】博士後期課程2年 武次広夢さんが IEEE 名古屋支部「国際会議研究発表賞」を受賞' },
      source: { en: 'Toyota Technological Institute', ja: '豊田工業大学' },
      date: '2026 / 05',
      href: 'https://www.toyota-ti.ac.jp/news/checktti/002900.html' },
    { title: { en: 'Doctoral student Hiromu Taketsugu receives the Encouragement Award at the 245th IPSJ CVIM meeting',
               ja: '【学生受賞】博士後期課程2年 武次広夢さんが「第245回 情報処理学会 コンピュータビジョンとイメージメディア研究会」において奨励賞を受賞' },
      source: { en: 'Toyota Technological Institute', ja: '豊田工業大学' },
      date: '2026 / 05',
      href: 'https://www.toyota-ti.ac.jp/news/checktti/002899.html' },
    { title: { en: "Off to TTIC: master's students on three months at the Chicago campus",
               ja: 'TTIC協定留学へ行こう！' },
      source: { en: 'Toyota Technological Institute · ADVANCE vol.118', ja: '豊田工業大学 広報誌 ADVANCE vol.118' },
      date: '2024 / 05',
      href: 'https://www.toyota-ti.ac.jp/about/advance/files/ADVANCEvol118_nouhin.pdf' },
    { title: { en: 'English Excellence Award recipients for the 2022 academic year',
               ja: '2022年度英語優秀賞 受賞者が決定しました' },
      source: { en: 'Toyota Technological Institute', ja: '豊田工業大学' },
      date: '2023 / 03',
      href: 'https://www.toyota-ti.ac.jp/news/checktti/002173.html' },
    { title: { en: "TTI's athletes: Spartan Race club members finish the course",
               ja: '豊田工大の肉体派！スパルタンレースサークルのメンバーが大会で完走' },
      source: { en: 'Toyota Technological Institute', ja: '豊田工業大学' },
      date: '2022 / 09',
      href: 'https://www.toyota-ti.ac.jp/news/checktti/002032.html' },
    { title: { en: 'The 13th English Science and Technology Presentation Contest',
               ja: '「英語科学技術プレゼンテーションコンテスト」開催' },
      source: { en: 'Toyota Technological Institute · ADVANCE vol.111', ja: '豊田工業大学 広報誌 ADVANCE vol.111' },
      date: '2022 / 01',
      href: 'https://www.toyota-ti.ac.jp/about/advance/files/advance111.pdf' }
  ],

  /* Withdrawn pending a rewrite by the owner. An empty items array hides
     the section and its nav link and renumbers the rest; the six previous
     entries are in git at 15bb2ec if any are worth carrying over. */
  life: {
    intro: { en: 'Research is most of the picture, but not all of it. A husband and a father of one, raising a small family between two languages, and a firm believer that the body and the mind train together.',
             ja: '研究は人生の大半ですが、すべてではありません。二つの言語のあいだで小さな家族を育てる、一児の父であり夫。心と体は一緒に鍛えるもの、と信じています。' },
    items: [],
    photos: []
  },

  /* Order, numbering, nav and visibility of every section, in one place. */
  sections: [
    { id: 'about',    title: { en: 'About', ja: '自己紹介' } },
    { id: 'news',     title: { en: "What's New", ja: '最新情報' },            nav: { en: 'News', ja: '最新情報' } },
    { id: 'work',     title: { en: 'Selected Publications', ja: '主要論文' }, nav: { en: 'Publications', ja: '論文' },
      note: { href: 'publications.html', label: { en: 'All publications →', ja: '全業績 →' } } },
    { id: 'domestic', title: { en: 'Domestic Presentations', ja: '国内発表' },
      note: { href: 'publications.html#domestic', label: { en: 'All presentations →', ja: 'すべての国内発表 →' } } },
    { id: 'awards',   title: { en: 'Awards & Honors', ja: '受賞' },           nav: { en: 'Awards', ja: '受賞' } },
    { id: 'funding',  title: { en: 'Fellowships & Grants', ja: '奨学金・助成' }, nav: { en: 'Funding', ja: '助成' } },
    { id: 'service',  title: { en: 'Service & Teaching', ja: '学会活動・教育' }, nav: { en: 'Service', ja: '活動' } },
    { id: 'timeline', title: { en: 'Experience', ja: '経歴' },                nav: { en: 'Experience', ja: '経歴' } },
    { id: 'talks',    title: { en: 'Talks & Presentations', ja: '講演・発表' }, nav: { en: 'Talks', ja: '発表' } },
    { id: 'media',    title: { en: 'Media & Coverage', ja: 'メディア掲載' },  nav: { en: 'Media', ja: 'メディア' } },
    { id: 'life',     title: { en: 'Outside the Lab', ja: '研究室の外で' },   nav: { en: 'Life', ja: '日常' } }
  ],

  /* The grid below the hero, in reading order: each tile's width in twelfths
     and, for a tall one, how many rows it spans. A section's tile goes when
     the section does. It is one column at every width, as on a phone. */
  layout: [
    ['about', 12],
    ['news', 12],
    ['work', 12],
    ['domestic', 12],
    ['awards', 12], ['funding', 12], ['service', 12],
    ['timeline', 12], ['talks', 12], ['media', 12],
    ['life', 12]
  ]
};
