---
title: Planning-oriented Autonomous Driving
authors:
- Yihan Hu
- Jiazhi Yang
- Li Chen
- Keyu Li
- Chonghao Sima
- Xizhou Zhu
- Siqi Chai
- Senyao Du
- Tianwei Lin
- Wenhai Wang
- Lewei Lu
- Xiaosong Jia
- Qiang Liu
- Jifeng Dai
- Yu Qiao
- Hongyang Li
date: '2023-03-01'
publishDate: '2023-11-24T20:07:33.062367Z'
publication_types:
- manuscript
publication: '*arXiv*'
doi: 10.48550/arXiv.2212.10156
abstract: Modern autonomous driving system is characterized as modular tasks in sequential
  order, i.e., perception, prediction, and planning. In order to perform a wide diversity
  of tasks and achieve advanced-level intelligence, contemporary approaches either
  deploy standalone models for individual tasks, or design a multi-task paradigm with
  separate heads. However, they might suffer from accumulative errors or deficient
  task coordination. Instead, we argue that a favorable framework should be devised
  and optimized in pursuit of the ultimate goal, i.e., planning of the self-driving
  car. Oriented at this, we revisit the key components within perception and prediction,
  and prioritize the tasks such that all these tasks contribute to planning. We introduce
  Unified Autonomous Driving (UniAD), a comprehensive framework up-to-date that incorporates
  full-stack driving tasks in one network. It is exquisitely devised to leverage advantages
  of each module, and provide complementary feature abstractions for agent interaction
  from a global perspective. Tasks are communicated with unified query interfaces
  to facilitate each other toward planning. We instantiate UniAD on the challenging
  nuScenes benchmark. With extensive ablations, the effectiveness of using such a
  philosophy is proven by substantially outperforming previous state-of-the-arts in
  all aspects. Code and models are public.
tags:
- BEV
links:
- name: URL
  url: http://arxiv.org/abs/2212.10156
---