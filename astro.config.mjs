// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages: https://vriti-labs-ai.github.io/vritilabs
// If you move to a custom domain, set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://vriti-labs-ai.github.io',
  base: '/vritilabs',
  trailingSlash: 'always',
  integrations: [mdx()],
  // Content Security Policy, emitted as a <meta> tag on every page. Astro hashes
  // our own inline scripts and styles; anything else is blocked by the browser.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src https://fonts.gstatic.com",
        "connect-src 'self' https://api.web3forms.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://fonts.googleapis.com', kind: 'element' },
          // inline style="" attributes (Shiki code colours, slider speed); cannot run code
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
});
