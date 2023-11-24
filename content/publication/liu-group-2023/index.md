---
title: 'Group Pose: A Simple Baseline for End-to-End Multi-person Pose Estimation'
authors:
- Huan Liu
- Qiang Chen
- Zichang Tan
- Jiang-Jiang Liu
- Jian Wang
- Xiangbo Su
- Xiaolong Li
- Kun Yao
- Junyu Han
- Errui Ding
- Yao Zhao
- Jingdong Wang
date: '2023-08-01'
publishDate: '2023-11-24T20:07:33.146433Z'
publication_types:
- manuscript
publication: '*arXiv*'
doi: 10.48550/arXiv.2308.07313
abstract: 'In this paper, we study the problem of end-to-end multi-person pose estimation.
  State-of-the-art solutions adopt the DETR-like framework, and mainly develop the
  complex decoder, e.g., regarding pose estimation as keypoint box detection and combining
  with human detection in ED-Pose, hierarchically predicting with pose decoder and
  joint (keypoint) decoder in PETR. We present a simple yet effective transformer
  approach, named Group Pose. We simply regard $K$-keypoint pose estimation as predicting
  a set of $Ntimes K$ keypoint positions, each from a keypoint query, as well as representing
  each pose with an instance query for scoring $N$ pose predictions. Motivated by
  the intuition that the interaction, among across-instance queries of different types,
  is not directly helpful, we make a simple modification to decoder self-attention.
  We replace single self-attention over all the $Ntimes(K+1)$ queries with two subsequent
  group self-attentions: (i) $N$ within-instance self-attention, with each over $K$
  keypoint queries and one instance query, and (ii) $(K+1)$ same-type across-instance
  self-attention, each over $N$ queries of the same type. The resulting decoder removes
  the interaction among across-instance type-different queries, easing the optimization
  and thus improving the performance. Experimental results on MS COCO and CrowdPose
  show that our approach without human box supervision is superior to previous methods
  with complex decoders, and even is slightly better than ED-Pose that uses human
  box supervision. $hrefhttps://github.com/Michel-liu/GroupPose-Paddlerm Paddle$ and
  $hrefhttps://github.com/Michel-liu/GroupPoserm PyTorch$ code are available.'
links:
- name: URL
  url: http://arxiv.org/abs/2308.07313
---
