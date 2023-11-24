---
title: "BEVFusion: Multi-Task Multi-Sensor Fusion with Unified Bird's-Eye View Representation"
authors:
- Zhijian Liu
- Haotian Tang
- Alexander Amini
- Xinyu Yang
- Huizi Mao
- Daniela Rus
- Song Han
date: '2022-06-01'
publishDate: '2023-11-24T20:07:33.047982Z'
publication_types:
- manuscript
publication: '*arXiv*'
abstract: "Multi-sensor fusion is essential for an accurate and reliable autonomous
  driving system. Recent approaches are based on point-level fusion: augmenting the
  LiDAR point cloud with camera features. However, the camera-to-LiDAR projection
  throws away the semantic density of camera features, hindering the effectiveness
  of such methods, especially for semantic-oriented tasks (such as 3D scene segmentation).
  In this paper, we break this deeply-rooted convention with BEVFusion, an efficient
  and generic multi-task multi-sensor fusion framework. It unifies multi-modal features
  in the shared bird's-eye view (BEV) representation space, which nicely preserves
  both geometric and semantic information. To achieve this, we diagnose and lift key
  efficiency bottlenecks in the view transformation with optimized BEV pooling, reducing
  latency by more than 40x. BEVFusion is fundamentally task-agnostic and seamlessly
  supports different 3D perception tasks with almost no architectural changes. It
  establishes the new state of the art on nuScenes, achieving 1.3% higher mAP and
  NDS on 3D object detection and 13.6% higher mIoU on BEV map segmentation, with 1.9x
  lower computation cost. Code to reproduce our results is available at https://github.com/mit-han-lab/bevfusion."
links:
- name: URL
  url: http://arxiv.org/abs/2205.13542
---
