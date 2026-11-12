import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const teams = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teams' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    order: z.number().default(99),
    // Set to nest this under another entry, e.g. Medical under Industry
    parent: reference('teams').optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    team: reference('teams'),
    featured: z.boolean().default(false),
    // Path inside /public, e.g. "drawings/my-sketch.svg"
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    // Who drew the illustration, shown as a credit
    artist: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    order: z.number().default(99),
    format: z.string().optional(),   // e.g. "6-week cohort"
    level: z.string().optional(),    // e.g. "Intermediate"
  }),
});

// Courses offered under an Educational Services program (e.g. Robotics).
const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    program: reference('services'),
    track: z.string().optional(),            // eyebrow, e.g. "Robot learning track"
    tagline: z.string(),                      // one-sentence summary for cards
    order: z.number().default(99),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    parts: z.array(z.object({ title: z.string(), lectures: z.string() })).default([]),
    audience: z.string().optional(),
    prerequisites: z.array(z.string()).default([]),
    capstone: z.string().optional(),
  }),
});

// Detailed lecture-by-lecture syllabus for a course. The file name must match
// the course id (e.g. src/content/syllabi/world-models-from-scratch.json).
const paper = z.object({ title: z.string(), cite: z.string(), url: z.string().url().optional() });
const lecture = z.object({
  number: z.number(),
  title: z.string(),
  folder: z.string().optional(),
  buildsOn: z.string().optional(),
  fixes: z.string().optional(),
  leavesOpen: z.string().optional(),
  theory: z.string(),
  programming: z.string(),
  papers: z.array(paper).default([]),
  milestone: z.string().optional(),
});
const syllabi = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/syllabi' }),
  schema: z.object({
    lecture0: lecture.optional(),
    parts: z.array(z.object({ title: z.string(), lectures: z.string(), blurb: z.string(), items: z.array(lecture) })),
    milestones: z.array(z.object({ id: z.string(), after: z.string(), title: z.string(), text: z.string() })).default([]),
  }),
});

// PLACEHOLDER testimonials live in src/content/testimonials.json — replace with real, consented quotes before launch.
const testimonials = defineCollection({
  loader: file('src/content/testimonials.json'),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string().optional(),
    // Path inside /public, e.g. "people/jane.jpg" (square works best)
    image: z.string().optional(),
    program: reference('services').optional(),
    // Shown instead of the program name, e.g. the session the quote is about
    context: z.string().optional(),
    // Where the quote was published, so readers can verify it
    source: z.string().url().optional(),
    order: z.number().default(99),
  }),
});

const talks = defineCollection({
  loader: file('src/content/talks.json'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    host: z.string(),
    format: z.string().default('Talk'),
    summary: z.string(),
    post: reference('posts').optional(),   // write-up on this site
    source: z.string().url().optional(),   // external link, e.g. the host's announcement
  }),
});

export const collections = { teams, posts, services, courses, syllabi, testimonials, talks };
