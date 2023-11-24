---
title: 'ViP3D: End-to-end Visual Trajectory Prediction via 3D Agent Queries'
authors:
- Junru Gu
- Chenxu Hu
- Tianyuan Zhang
- Xuanyao Chen
- Yilun Wang
- Yue Wang
- Hang Zhao
date: '2023-06-01'
publishDate: '2023-11-24T20:07:33.070125Z'
publication_types:
- manuscript
publication: '*arXiv*'
doi: 10.48550/arXiv.2208.01582
abstract: Perception and prediction are two separate modules in the existing autonomous
  driving systems. They interact with each other via hand-picked features such as
  agent bounding boxes and trajectories. Due to this separation, prediction, as a
  downstream module, only receives limited information from the perception module.
  To make matters worse, errors from the perception modules can propagate and accumulate,
  adversely affecting the prediction results. In this work, we propose ViP3D, a query-based
  visual trajectory prediction pipeline that exploits rich information from raw videos
  to directly predict future trajectories of agents in a scene. ViP3D employs sparse
  agent queries to detect, track, and predict throughout the pipeline, making it the
  first fully differentiable vision-based trajectory prediction approach. Instead
  of using historical feature maps and trajectories, useful information from previous
  timestamps is encoded in agent queries, which makes ViP3D a concise streaming prediction
  method. Furthermore, extensive experimental results on the nuScenes dataset show
  the strong vision-based prediction performance of ViP3D over traditional pipelines
  and previous end-to-end models.
links:
- name: URL
  url: http://arxiv.org/abs/2208.01582
---
