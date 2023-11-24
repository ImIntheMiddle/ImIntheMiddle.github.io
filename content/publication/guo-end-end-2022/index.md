---
title: End-to-End Trajectory Distribution Prediction Based on Occupancy Grid Maps
authors:
- Ke Guo
- Wenxi Liu
- Jia Pan
date: '2022-06-01'
publishDate: '2023-11-24T20:07:33.040689Z'
publication_types:
- paper-conference
publication: '*2022 IEEE/CVF Conference on Computer Vision and Pattern Recognition
  (CVPR)*'
doi: 10.1109/CVPR52688.2022.00228
abstract: In this paper, we aim to forecast a future trajectory distribution of a
  moving agent in the real world, given the social scene images and historical trajectories.
  Yet, it is a challenging task because the ground-truth distribution is unknown and
  unobservable, while only one of its samples can be applied for supervising model
  learning, which is prone to bias. Most recent works focus on predicting diverse
  trajectories in order to cover all modes of the real distribution, but they may
  despise the precision and thus give too much credit to unrealistic predictions.
  To address the issue, we learn the distribution with symmetric cross-entropy using
  occupancy grid maps as an explicit and scene-compliant approximation to the ground-truth
  distribution, which can effectively penalize unlikely predictions. In specific,
  we present an inverse reinforcement learning based multi-modal trajectory distribution
  forecasting framework that learns to plan by an approximate value iteration network
  in an end-to-end manner. Besides, based on the predicted distribution, we generate
  a small set of representative trajectories through a differentiable Transformer-based
  network, whose attention mechanism helps to model the relations of trajectories.
  In experiments, our method achieves state-of-the-art performance on the Stanford
  Drone Dataset and Intersection Drone Dataset.
links:
- name: URL
  url: https://ieeexplore.ieee.org/document/9879534/
---
