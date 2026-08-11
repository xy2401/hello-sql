import docsConfig from '../docs/.vitepress/config';

// Cloudflare Pages' VitePress preset runs `vitepress build` from the
// repository root and publishes `.vitepress/dist`. Keep that conventional
// entry point working while the documentation source remains in `docs/`.
export default {
  ...docsConfig,
  srcDir: './docs',
  outDir: './.vitepress/dist',
};
