---
title: 'ViewBirdiformer: Learning to recover ground-plane crowd trajectories and ego-motion
  from a single ego-centric view'
authors:
- Mai Nishimura
- Shohei Nobuhara
- Ko Nishino
date: '2022-10-01'
publishDate: '2023-11-24T20:07:32.976520Z'
publication_types:
- manuscript
publication: '*arXiv*'
doi: 10.48550/arXiv.2210.06332
abstract: We introduce a novel learning-based method for view birdification, the task
  of recovering ground-plane trajectories of pedestrians of a crowd and their observer
  in the same crowd just from the observed ego-centric video. View birdification becomes
  essential for mobile robot navigation and localization in dense crowds where the
  static background is hard to see and reliably track. It is challenging mainly for
  two reasons; i) absolute trajectories of pedestrians are entangled with the movement
  of the observer which needs to be decoupled from their observed relative movements
  in the ego-centric video, and ii) a crowd motion model describing the pedestrian
  movement interactions is specific to the scene yet unknown a priori. For this, we
  introduce a Transformer-based network referred to as ViewBirdiformer which implicitly
  models the crowd motion through self-attention and decomposes relative 2D movement
  observations onto the ground-plane trajectories of the crowd and the camera through
  cross-attention between views. Most important, ViewBirdiformer achieves view birdification
  in a single forward pass which opens the door to accurate real-time, always-on situational
  awareness. Extensive experimental results demonstrate that ViewBirdiformer achieves
  accuracy similar to or better than state-of-the-art with three orders of magnitude
  reduction in execution time.
links:
- name: URL
  url: http://arxiv.org/abs/2210.06332
---
