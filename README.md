# Vriti Labs Research

> **Contributors and AI assistants:** read [specification.md](specification.md) first. It is the source of truth for structure, content model, design tokens and the owner's decisions.

A static research hub built with [Astro](https://astro.build), deployed to GitHub Pages.

## Run locally

```sh
npm install
npm run dev        # http://localhost:4321/
npm run build      # outputs to dist/
```

## Add a post

Create `src/content/posts/my-post.md` (or `.mdx`):

```md
---
title: "My post title"
summary: "One or two sentences shown on cards."
date: 2026-11-08
team: ai-evaluations     # must match a file in src/content/teams/
featured: true           # shows in the homepage carousel (max 5)
image: drawings/my-sketch.svg
imageAlt: "Describe the drawing"
artist: Your Name
draft: false
---

Article body in Markdown…
```

## Add a solution or product

Create `src/content/teams/<id>.md` with `name`, `description` and `order`. These appear on the site as "Solution & Products" (URL: `/solutions/<id>/`).

## Illustrations

1. Draw on paper or a tablet in black ink.
2. Scan or export as PNG, then vectorize: `vtracer --input sketch.png --output sketch.svg --colormode binary`
3. Save it in `public/drawings/` and reference it as `drawings/sketch.svg`.

The images in `public/drawings/` now are Rough.js placeholders. Replace them with real drawings.
Hand-drawn borders and dividers (`HandBox`, `HandRule`) are rendered by Rough.js at build time, so they ship no JavaScript.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
Live at https://vritilabs.ai/

