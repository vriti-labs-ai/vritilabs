// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Hosted on GitHub Pages with the custom domain https://vritilabs.ai
// (no base path: the site is served from the domain root).
export default defineConfig({
  site: 'https://vritilabs.ai',
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
