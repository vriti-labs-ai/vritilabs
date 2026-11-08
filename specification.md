# Vriti Labs website: specification

This is the source of truth for the Vriti Labs website. Read it before making changes. It records what the site is, how it is built, and the decisions the owner has already made, so you don't undo them.

Last updated: 2026-11-08 (the six placeholder research posts were deleted; only the two real posts remain)

---

## 1. What the site is

**Vriti Labs** is a research and education organization focused on AI. The site is a research hub modelled on the *layout and feel* of https://www.anthropic.com/research: an intro, a featured carousel, category tiles, and a filterable grid of research posts. It is not a copy of Anthropic's branding, logo, fonts or wording, and must never become one.

**Visual identity:** a hand-drawn, editorial look in a world of AI-generated imagery. Sketchy borders, dividers and diagrams; warm cream paper; deep green serif headings; soft illustration tints.

**Focus areas (as set by the owner):**

| Products & Services | Educational Services |
|---|---|
| AI Evaluations | Robotics |
| Industry → Medical | Reinforcement Learning |
| Agentic AI | Evaluations |

**About the team (owner-supplied facts, do not embellish):**
- Backed by professionals with a combined **30 years** of experience in data science and AI (exactly 30, not "30+").
- Experience areas: Supply Chain, Smarter Cities (IoT), Insurance Fraud, Decision Making.
- Alumni of: Indian Statistical Institute, BITS Pilani, IIT.

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | **Astro 7** (static output), with `@astrojs/mdx` |
| Content | Astro Content Collections (Content Layer API: `glob` and `file` loaders, Zod schemas from `astro/zod`) |
| Hand-drawn graphics | **Rough.js 4**, run at **build time** inside `.astro` components. It outputs inline SVG and ships no client JavaScript. |
| Styling | Plain CSS: global design tokens in `src/styles/global.css`, plus scoped `<style>` blocks per component. No Tailwind. |
| Fonts | Google Fonts: Newsreader (serif headings and body), Inter (sans UI), Caveat (handwritten accent) |
| Client JS | Small inline `<script>` blocks only, for the carousel and the grid filter, sort, view toggle and "See more" |
| Node | Astro 7 requires Node ≥ 22.23.4 (developed on Node 23) |
| Hosting | GitHub Pages via GitHub Actions |

### Commands

```sh
npm install
npm run dev       # http://localhost:4321/
npm run build     # outputs to dist/; must finish with no errors
npm run preview
```

### Deployment

- Repo: `https://github.com/vriti-labs-ai/vritilabs`
- Live URL: `https://vritilabs.ai/` (custom domain; `vriti-labs-ai.github.io/vritilabs/` redirects to it)
- Workflow: `.github/workflows/deploy.yml` runs on every push to `main` (`actions/checkout@v7`, `withastro/action@v6`, `actions/deploy-pages@v5`).
- One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
- `astro.config.mjs` sets `site: 'https://vritilabs.ai'` (no `base`) and `trailingSlash: 'always'`.
- **Custom domain:** `vritilabs.ai` is set in repo **Settings → Pages → Custom domain** (enter the bare domain, with no `https://` and no trailing `/`).
  - DNS at the registrar:
    - Apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
    - Apex `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
    - `www` `CNAME` → `vriti-labs-ai.github.io`.
  - Turn on **Enforce HTTPS** once the certificate is issued.
  - With Actions-based deploys, no `CNAME` file is needed in the repo.

---

## 3. Project structure

```
.github/workflows/deploy.yml     GitHub Pages deploy
astro.config.mjs                 site, base path, MDX
public/
  drawings/*.svg                 post cover illustrations (currently placeholders)
  people/*.svg                   testimonial portraits (currently placeholders)
src/
  content.config.ts              ALL collection schemas (see §5)
  content/
    posts/*.md|mdx               research posts
    teams/*.md                   Products & Services entries (folder name is historical, see §8)
    services/*.md                Educational Services programs
    testimonials.json            testimonial quotes
    talks.json                   talks & sessions
  components/                    see §7
  layouts/Base.astro             <head>, fonts, Header, Footer
  lib/utils.ts                   url(), formatDate(), getPosts(), getTeams(), withChildren(), getTeamTiles(), getServices()
  pages/                         routes (see §4)
  styles/global.css              design tokens and base styles
```

---

## 4. Pages and routes

All routes are served from the domain root and end with a trailing slash.

| Route | File | Contents |
|---|---|---|
| `/` | `pages/index.astro` | Intro ("Research at Vriti Labs"), featured carousel (posts with `featured: true`, max 5), **Products & Services** tiles, "All research" grid with filter, sort, gallery/list toggle and "See more" |
| `/research/<id>/` | `pages/research/[id].astro` | Single post: eyebrow (category · date), title, summary, cover image, MDX body, back link |
| `/solutions/` | `pages/solutions/index.astro` | **Products & Services** top-level tiles |
| `/solutions/<id>/` | `pages/solutions/[id].astro` | One entry: breadcrumb (parent if nested), "Focus areas" sub-tiles if it has children, posts for it and its children, or a "coming soon" line if there are none |
| `/education/` | `pages/education/index.astro` | **Educational Services**: Programs tiles, then the "What learners say" sliding testimonials, then "Talks & sessions" |
| `/education/<id>/` | `pages/education/[id].astro` | Program detail (format · level, description, Markdown body) |
| `/contact/` | `pages/contact.astro` | Contact form and email address (see §8a) |
| `/about/` | `pages/about.astro` | About text, a large "30" statistic, experience-area tiles, alumni labels |

**Top navigation order (owner's choice):** Educational Services · Research · Products & Services · About · Contact. The footer "Explore" column uses the same order.

---

## 5. Content model

All schemas live in `src/content.config.ts`. **Change a schema there first**, then the content. The build fails on invalid frontmatter, which is intended.

### 5.1 `posts`: research posts (`src/content/posts/*.md|mdx`)

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `summary` | string | required; 1–2 sentences, shown on cards |
| `date` | date | required; `YYYY-MM-DD` |
| `team` | reference → `teams` | required; the Products & Services id, e.g. `ai-evaluations`, `medical` |
| `featured` | boolean | default `false`; up to 5 featured posts appear in the homepage carousel |
| `image` | string | path inside `/public`, e.g. `drawings/foo.svg` (no leading slash) |
| `imageAlt` | string | describe the content only; do **not** say "hand-drawn" or "sketched" (§8) |
| `artist` | string | optional; stored but **not displayed** anywhere |
| `draft` | boolean | default `false`; drafts are excluded everywhere |

In MDX posts, import diagram components with relative paths, e.g. `import HandTimeline from '../../components/HandTimeline.astro';`

### 5.2 `teams`: Products & Services (`src/content/teams/*.md`)

| Field | Type | Notes |
|---|---|---|
| `name` | string | displayed name |
| `description` | string | one sentence |
| `order` | number | sort order among siblings |
| `parent` | reference → `teams` | optional; nests an entry (e.g. `medical` has `parent: industry`) |

Current entries: `ai-evaluations` (order 1), `industry` (order 2), `medical` (parent `industry`), `agentic-ai` (order 3).
- Both current research posts are filed under `agentic-ai` (owner's instruction).
- Top-level tiles show only entries without a parent; their children appear as chips on the parent tile.
- Post counts include children; a count of 0 shows "Coming soon".
- **To add an industry:** create `src/content/teams/finance.md` with `parent: industry`.

### 5.3 `services`: Educational Services programs (`src/content/services/*.md`)

Fields: `name`, `description`, `order`, `format` (e.g. "8-week course"; shown as the tile's meta label), `level` (e.g. "Intermediate"). The body is Markdown, shown on the detail page.

Current: `robotics`, `reinforcement-learning`, `evaluations`.

### 5.4 `testimonials` (`src/content/testimonials.json`, an array; each entry needs a unique `id`)

| Field | Notes |
|---|---|
| `quote`, `name` | required |
| `role` | optional, e.g. organisation location or job title |
| `image` | optional path in `/public` (square); without it, the tile shows initials in a sage circle |
| `program` | optional reference → `services` |
| `context` | optional; shown instead of the program name (e.g. the session the quote is about) |
| `source` | optional URL; renders "View original post ↗" |
| `order` | lower numbers come first |

### 5.5 `talks` (`src/content/talks.json`)

Fields: `id`, `title`, `date`, `host`, `format` (default "Talk"), `summary`, `post` (reference → `posts`, the write-up on this site), `source` (external announcement URL).

---

## 6. Design system

### 6.1 Colour tokens (`src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#efead5` | page background (owner-specified) |
| `--paper-2` | `#e5dec4` | secondary surfaces: image placeholders, testimonial tiles |
| `--ink` | `#1a1915` | body text, borders, sketch strokes |
| `--ink-soft` | `#5c5a52` | secondary text, the "labs" in the logo |
| `--line` | `#d6ceb3` | table rules |
| `--heading` | `#2a5019` | **all h1/h2/h3**, deep green (owner-specified) |
| `--tile-bg` | `#c8d5bf` | tile fill (sage) |
| `--tile-bg-hover` | `#b8c8ad` | tile hover |
| `--tint-rose / sage / sky / sand` | `#e9c9c1 / #c8d5bf / #c4d4e0 / #e8d9b5` | illustration backgrounds; keep the palette to these |

A subtle paper-grain SVG noise is layered over the body background.

### 6.2 Typography

- **Headings:** Newsreader, weight 400, in `--heading` green.
- **Article body:** Newsreader, 20px, line height 1.65, max width 680px.
- **UI, labels, cards:** Inter.
- **Logo:** "Vriti" in serif, followed by "labs" in Caveat, coloured `--ink-soft` in the header.

### 6.3 Layout

- `.wrap` gives a max width of 1200px with a fluid side gutter (`--gutter`). Every section, the testimonial slider included, stays inside `.wrap`; nothing spans the full page width.
- Grids use `auto-fill` / `minmax()` so they reflow on phones; diagrams scroll horizontally inside their own container when the screen is narrow.

---

## 7. Components (`src/components/`)

| Component | Purpose |
|---|---|
| `Header.astro`, `Footer.astro` | nav and footer; edit labels and order in both |
| `HandRule.astro` | hand-drawn horizontal divider. Props: `seed`, `roughness` |
| `HandBox.astro` | wraps any content in a hand-drawn rectangle border. Props: `seed`, `class` |
| `Tiles.astro` | generic tile grid. Props: `title`, `tiles: {href, name, description, meta?, tags?}[]`, `headingLevel` (`h1` or `h2`). Used for Products & Services, sub-areas and Programs |
| `FeaturedCarousel.astro` | homepage carousel with "01 / 0N" counter and scroll-snap |
| `PostGrid.astro` | post grid with filter, sort, list/gallery view and "See more". Props: `posts`, `teamNames`, `showFilters`, `pageSize` |
| `PostCard.astro` | single post card |
| `Testimonials.astro` | infinite sliding row of quote tiles. Pauses on hover or focus; becomes a swipeable row when the visitor prefers reduced motion |
| `Talks.astro` | "Talks & sessions" list |
| `HandTimeline.astro` | MDX diagram: tilted year tags on a line. Props: `items: {year, label, highlight?}[]`, `seed`, `caption` |
| `HandFlow.astro` | MDX diagram: numbered steps joined by a line. Props: `steps: string[]`, `seed`, `caption` |
| `HandSum.astro` | MDX: "A + B + C" with hand-drawn plus signs. Props: `terms` (HTML strings allowed) |

**Rough.js conventions:** use `rough.generator()` in the component's frontmatter, then `gen.toPaths(drawable)` and render `<path>` elements. Always pass a fixed `seed` so the output is the same on every build. A path with `stroke: 'none'` is a fill; give it `fill={p.fill}` and no stroke.

---

## 8. Owner decisions and rules (do not reverse without asking)

1. **Never name the speaker or author in research posts.** The Agentic AI post is "adapted from an expert session given to the Consulting Club, DMSIE, IIT (ISM) Dhanbad", with no person's name. In quotes, replace the name with "…".
2. **Do not mention on the site that images are hand-drawn.** No "drawn by hand" lines, no artist credits, and no "hand-drawn" or "sketched" in alt text. The hand-drawn *style* stays; it just isn't described.
3. **Colours the owner tried and rejected:**
   - Lime `#DDE64D` as heading colour: rejected (unreadable on cream).
   - Lime as the colour of "labs" in the logo, with and without a black outline: rejected.
   - Lime as tile fill: replaced by sage `#C8D5BF`.
   - A green full-width header bar: rejected; the header stays on cream.

   Use lime only if the owner asks for it again.
4. **Section label is "Products & Services".** It was "Teams", then "Solution & Products". The URL stays `/solutions/` and the content folder stays `src/content/teams/`; both names are historical, so don't rename them unless asked.
5. **Brand safety:** keep the Anthropic-inspired layout, but never use Anthropic's (or any other company's) logo, fonts, copy or imagery. Don't embed third-party screenshots; describe them in prose or redraw them as diagrams.
6. **Privacy:** don't republish photos or screenshots that show private individuals (e.g. attendees on video calls) without their consent.
7. **Accuracy:** don't exaggerate the owner's facts (e.g. 30 years means 30, not "30+"). The institute is spelled "BITS Pilani".
8. **Testimonials must be real and attributable.** Real ones carry a `source` URL.

---

## 8a. Contact form and security

**Destination:** contact@vritilabs.com. The address is split in the HTML and assembled by JavaScript, so simple scrapers don't find it.

**Two modes:**
1. **Default (no setup):** "Send" opens the visitor's own email app with the message pre-filled. Nothing is sent to any server, so there is no endpoint to abuse.
2. **Direct send:** set a GitHub repository *variable* `WEB3FORMS_KEY` (Settings → Secrets and variables → Actions → Variables). The deploy workflow exposes it as `PUBLIC_WEB3FORMS_KEY`, and the form then POSTs to `https://api.web3forms.com/submit`. The key is public by design; it can only deliver to the address it was registered with. For local testing, put `PUBLIC_WEB3FORMS_KEY=...` in `.env`, which is git-ignored.

**Anti-abuse measures, client side, all in `contact.astro`:**
- A honeypot field `botcheck`.
- A minimum fill time of 3 seconds.
- A limit of 3 sends per browser session.
- Length caps and control-character stripping.
- Strict email check, with `aria-invalid` marking on bad fields.
- Status messages written with `textContent` only.
- Bots get a fake "thanks", so they learn nothing.

**Content Security Policy (whole site):** `security.csp` in `astro.config.mjs` emits a `<meta>` CSP on every page. Astro hashes our inline scripts and styles. The policy allows `default-src 'self'`, Google Fonts, `data:` images, and `connect-src` to `api.web3forms.com` only. It blocks `object-src`, limits `base-uri` and `form-action` to the site itself, and allows inline `style=""` attributes only (needed for Shiki code colours and the slider speed).
- **Rule:** styles for components used *inside MDX posts* must live in a global stylesheet (e.g. `src/styles/diagrams.css`), because Astro doesn't hash scoped styles rendered from content collections. Otherwise the browser blocks them.
- **Any new external host** (script, font, API, image CDN) must be added to the CSP directives, or it will silently fail.
- **Limitation:** GitHub Pages can't send HTTP headers, so `frame-ancestors` (clickjacking protection) isn't possible via `<meta>`. A host like Cloudflare Pages would allow it.
- **Verify** with `npm run build && npx astro preview`. CSP applies to the production build, not to `astro dev`.

## 9. Placeholders: replace before launch

| Item | Where | Status |
|---|---|---|
| Cover illustrations for the two real posts | `public/drawings/agentic-economics.svg`, `context-funnel.svg` | Generated with Rough.js; replace with real drawings |
| Testimonials `t1` (Sanjay M) and `t3` (Sajikumar M) | `src/content/testimonials.json` | Names supplied by the owner; the **quote wording was drafted by the assistant**, so confirm each person approved it. The `iit-ism-*` entries are sourced quotes and appear first |
| Portrait images | `public/people/placeholder-1.svg`, `placeholder-3.svg` | Generic sketches |
| Program details: lengths, the "Intermediate" level, curriculum sections | `src/content/services/*.md` | Invented by the assistant; confirm with the owner |
| Products & Services descriptions | `src/content/teams/*.md` | Assistant-written; confirm with the owner |
| About page experience-area one-liners | `domains` array in `src/pages/about.astro` | Assistant-written; confirm with the owner |
| Talk date 2026-11-06 | `src/content/talks.json`, Agentic AI post `date` | Approximate (LinkedIn showed "2d" on 2026-11-08) |
| Footer "Elsewhere" | `Footer.astro` | Only the GitHub org link so far |

**Real content:**
- The post `agentic-ai-economics-of-autonomy.mdx` (from the owner's slide deck).
- The post `data-is-the-agent.mdx`, dated 2026-10-04 (the first Sunday of October, backdated at the owner's request). It is adapted from the owner's co-authored article draft "Data Is the Agent: Lessons from the Trenches of Production Agentic AI". Author names and employer and product names were removed; the diagrams were redrawn with `HandFlow` and the radar chart was replaced by a qualitative table.
- Both talk entries in `talks.json`: the IIT (ISM) Dhanbad session, and the IIT Guwahati session of 2026-10-15 ("From Tokens to Transformers" course, from the event poster). Speakers are not named, and the poster's IBM logo and photos are not used.
- No testimonial exists for the IIT Guwahati session yet. Add one only if a real participant quote with a public source is supplied.
- Testimonials `iit-ism-thanks` and `iit-ism-future`, quoted from the Consulting Club's public LinkedIn post: https://www.linkedin.com/feed/update/urn:li:activity:7524533295024484353/

---

## 10. How to contribute

### Add a research post
1. Create `src/content/posts/<slug>.md` (or `.mdx` to use diagram components) with the frontmatter from §5.1.
2. Set `team` to an existing Products & Services id.
3. Put the cover in `public/drawings/` and reference it as `drawings/<file>`.
4. Run `npm run build`; it must succeed.

### Add a program, testimonial or talk
Add a file to `src/content/services/`, or add an entry to `testimonials.json` / `talks.json`, following §5.

### Change a colour or font
Edit the tokens in `src/styles/global.css`. Components read only the tokens, so don't hard-code colours in components.

### Add a new collection field
1. Add it to the Zod schema in `src/content.config.ts`.
2. Update the components that render it.
3. Restart the dev server (see Gotchas).

### Verification checklist (before you report a change as done)
- `npm run build` finishes with no errors.
- View the affected page at desktop (~1300px) and phone (~400–500px) widths.
- None of the §8 rules are broken (no speaker name, no "hand-drawn" wording, no rejected colours).

---

## 11. Gotchas

- **Stale content cache:** after changing `content.config.ts` or JSON collection files, the dev server may keep serving old data. Fix it with: `npx astro dev stop; rm -rf .astro node_modules/.astro; npm run dev`.
- **Background dev server:** in Astro 7, `astro dev` runs in the background. Manage it with `npx astro dev status | logs | stop`.
- **Links:** build internal links with `url('path/')` from `src/lib/utils.ts`. It handles any base path, so links survive a future hosting change. In Markdown, absolute image links are `/drawings/...`.
- **Hiding elements:** `[hidden] { display: none !important; }` is global, because component styles otherwise override the `hidden` attribute.
- **Untracked files:** files not yet committed can't be renamed with `git mv`; use a plain `mv`.
- **Headless screenshots:** Chrome headless won't render narrower than about 500px, and CSS animations may look frozen in screenshots. Check motion by measuring `transform` over time, not visually.

---

## 12. Open ideas (not yet built)

- A footer in the header style, or social links (LinkedIn) under "Elsewhere".
- A specific IIT campus name on the About page, if the owner wants it.
- Real hand-drawn portraits for testimonials.
- An RSS feed, sitemap and Open Graph images.
- Pagefind static search.
