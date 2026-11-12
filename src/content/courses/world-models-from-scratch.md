---
title: World Models from Scratch
program: robotics
track: Robot learning track
tagline: Build a modern robot world model one component at a time, then train a policy for the SO-101 arm inside it.
order: 1
facts:
  - label: Format
    value: 16 lectures, each theory and intuition, then programming
  - label: Lectures 1–15
    value: Simulated SO-101 arm in MuJoCo
  - label: Lecture 16
    value: The real SO-101 arm, via LeRobot
  - label: Stack
    value: PyTorch, LeRobot, MuJoCo, gsplat
highlights:
  - title: Build every component yourself
    text: Each part of the system is built by hand at small scale, in one package that grows lecture by lecture. The final demo runs on code you wrote.
  - title: Simulator first, real arm last
    text: Fifteen lectures on a simulated SO-101, checked against ground truth, then the whole system moves onto the physical arm in the final lecture.
  - title: Three frontier ideas, one system
    text: Spatial 3D worlds, latent predictive models (JEPA) and generalist vision-language-action policies, combined into a single working world model.
  - title: Every improvement is a number
    text: Each lab ends with a measured failure that the next lecture fixes, and every model reports to one shared scoreboard.
  - title: Trained in imagination, proven on the arm
    text: The capstone is a pick-and-place policy improved by reinforcement learning inside your own world model, running on the real robot.
  - title: Grounded in current research
    text: Over 50 papers across the course, from the original World Models paper to the latest robot foundation models.
parts:
  - title: Grounding, simulator and data
    lectures: Lectures 1–3
  - title: Perception and representation
    lectures: Lectures 4–5
  - title: Learning dynamics
    lectures: Lectures 6–8
  - title: Rendering and grounding
    lectures: Lectures 9–11
  - title: Acting inside the world model
    lectures: Lectures 12–15
  - title: From simulator to the real SO-101
    lectures: Lecture 16
audience: Graduate students and working ML engineers who have trained deep learning models and are comfortable reading papers.
prerequisites:
  - Python and PyTorch, including writing your own training loops
  - Core deep learning, especially transformers and attention
  - Linear algebra, calculus and probability (Gaussians, KL divergence)
  - "Helpful: reinforcement learning basics, generative models and robotics fundamentals. An optional Lecture 0 covers these."
capstone: Everyone completes the same core capstone, a pick-and-place policy improved by RL inside your own world model and running on the real SO-101, plus one extension track. Four milestones keep it on schedule.
---

Build a modern robot world model one component at a time, then train a policy for the SO-101 arm inside it. Everything is built and tested in simulation first, and the finished system moves onto the real robot in the final lecture.

The finished system draws on three current lines of work: spatial 3D worlds, latent predictive models and generalist robot policies.
