---
title: 'Trace and Pace: Controllable Pedestrian Animation via Guided Trajectory Diffusion'
authors:
- Davis Rempe
- Zhengyi Luo
- Xue Bin Peng
- Ye Yuan
- Kris Kitani
- Karsten Kreis
- Sanja Fidler
date: -01-01
publishDate: '2023-11-24T20:07:33.132074Z'
publication_types:
- article-journal
abstract: We introduce a method for generating realistic pedestrian trajectories and
  full-body animations that can be controlled to meet user-defined goals. We draw
  on recent advances in guided diffusion modeling to achieve test-time controllability
  of trajectories, which is normally only associated with rule-based systems. Our
  guided diffusion model allows users to constrain trajectories through target waypoints,
  speed, and specified social groups while accounting for the surrounding environment
  context. This trajectory diffusion model is integrated with a novel physics-based
  humanoid controller to form a closed-loop, full-body pedestrian animation system
  capable of placing large crowds in a simulated environment with varying terrains.
  We further propose utilizing the value function learned during RL training of the
  animation controller to guide diffusion to produce trajectories better suited for
  particular scenarios such as collision avoidance and traversing uneven terrain.
  Video results are available on the project page.
---