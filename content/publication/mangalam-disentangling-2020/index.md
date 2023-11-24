---
title: Disentangling Human Dynamics for Pedestrian Locomotion Forecasting with Noisy
  Supervision
authors:
- Karttikeya Mangalam
- Ehsan Adeli
- Kuan-Hui Lee
- Adrien Gaidon
- Juan Carlos Niebles
date: '2020-04-01'
publishDate: '2023-11-24T20:07:32.983973Z'
publication_types:
- manuscript
publication: '*arXiv*'
doi: 10.48550/arXiv.1911.01138
abstract: 'We tackle the problem of Human Locomotion Forecasting, a task for jointly
  predicting the spatial positions of several keypoints on the human body in the near
  future under an egocentric setting. In contrast to the previous work that aims to
  solve either the task of pose prediction or trajectory forecasting in isolation,
  we propose a framework to unify the two problems and address the practically useful
  task of pedestrian locomotion prediction in the wild. Among the major challenges
  in solving this task is the scarcity of annotated egocentric video datasets with
  dense annotations for pose, depth, or egomotion. To surmount this difficulty, we
  use state-of-the-art models to generate (noisy) annotations and propose robust forecasting
  models that can learn from this noisy supervision. We present a method to disentangle
  the overall pedestrian motion into easier to learn subparts by utilizing a pose
  completion and a decomposition module. The completion module fills in the missing
  key-point annotations and the decomposition module breaks the cleaned locomotion
  down to global (trajectory) and local (pose keypoint movements). Further, with Quasi
  RNN as our backbone, we propose a novel hierarchical trajectory forecasting network
  that utilizes low-level vision domain specific signals like egomotion and depth
  to predict the global trajectory. Our method leads to state-of-the-art results for
  the prediction of human locomotion in the egocentric view. Project pade: https://karttikeya.github.io/publication/plf/'
links:
- name: URL
  url: http://arxiv.org/abs/1911.01138
---
