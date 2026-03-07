import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import rehypeSlug from 'rehype-slug';
import { userConfig } from './usr/user.config.mjs';
import { contentAssetsIntegration } from './core/integrations/contentAssetsIntegration.ts';

const coreIntegrations = [
  contentAssetsIntegration(),
  expressiveCode({
    themes: ['github-dark'],
    plugins: [pluginLineNumbers()],
    defaultProps: { showLineNumbers: true },
  }),
  mdx(),
  react(),
  sitemap(),
];

const coreAlias = {
  '@core': fileURLToPath(new URL('./core', import.meta.url)),
  '@user': fileURLToPath(new URL('./usr', import.meta.url)),
  '@components': fileURLToPath(new URL('./usr/components', import.meta.url)),
  '@layouts': fileURLToPath(new URL('./usr/layouts', import.meta.url)),
  '@content': fileURLToPath(new URL('./usr/content', import.meta.url)),
};

const coreDedupe = ['react', 'react-dom', '@tanstack/react-table'];

export default defineConfig({
  site: userConfig.site ?? 'https://lad-sapienza.it',
  output: 'static',
  srcDir: fileURLToPath(new URL('./usr', import.meta.url)),
  publicDir: fileURLToPath(new URL('./usr/public', import.meta.url)),

  markdown: {
    rehypePlugins: [rehypeSlug],
    ...(userConfig.markdown || {}),
    rehypePlugins: [
      rehypeSlug,
      ...(userConfig.markdown?.rehypePlugins || []),
    ],
  },

  integrations: [
    ...coreIntegrations,
    ...(userConfig.integrations || []),
  ],

  vite: {
    ...(userConfig.vite || {}),
    resolve: {
      ...(userConfig.vite?.resolve || {}),
      alias: {
        ...coreAlias,
        ...(userConfig.vite?.resolve?.alias || {}),
      },
      dedupe: [
        ...coreDedupe,
        ...(userConfig.vite?.resolve?.dedupe || []),
      ],
    },
  },
});