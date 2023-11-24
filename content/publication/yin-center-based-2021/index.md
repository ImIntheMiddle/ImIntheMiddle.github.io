---
title: Center-based 3D Object Detection and Tracking
authors:
- Tianwei Yin
- Xingyi Zhou
- Philipp Krähenbühl
date: '2021-01-01'
publishDate: '2023-11-24T20:07:33.055234Z'
publication_types:
- manuscript
publication: '*arXiv*'
abstract: Three-dimensional objects are commonly represented as 3D boxes in a point-cloud.
  This representation mimics the well-studied image-based 2D bounding-box detection
  but comes with additional challenges. Objects in a 3D world do not follow any particular
  orientation, and box-based detectors have difficulties enumerating all orientations
  or fitting an axis-aligned bounding box to rotated objects. In this paper, we instead
  propose to represent, detect, and track 3D objects as points. Our framework, CenterPoint,
  first detects centers of objects using a keypoint detector and regresses to other
  attributes, including 3D size, 3D orientation, and velocity. In a second stage,
  it refines these estimates using additional point features on the object. In CenterPoint,
  3D object tracking simplifies to greedy closest-point matching. The resulting detection
  and tracking algorithm is simple, efficient, and effective. CenterPoint achieved
  state-of-the-art performance on the nuScenes benchmark for both 3D detection and
  tracking, with 65.5 NDS and 63.8 AMOTA for a single model. On the Waymo Open Dataset,
  CenterPoint outperforms all previous single model method by a large margin and ranks
  first among all Lidar-only submissions. The code and pretrained models are available
  at https://github.com/tianweiy/CenterPoint.
links:
- name: URL
  url: http://arxiv.org/abs/2006.11275
---
