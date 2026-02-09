import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import rehypeSlug from 'rehype-slug';

// Import user configuration
import { userConfig } from './usr/user.config.mjs';

// Core configuration
const coreConfig = {
  site: 'https://example.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  srcDir: fileURLToPath(new URL('./usr', import.meta.url)),
  publicDir: fileURLToPath(new URL('./usr/public', import.meta.url)),
  
  markdown: {
    rehypePlugins: [rehypeSlug],
  },
  
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
    }),
    mdx(),
    react(),
    sitemap(),
    // tailwind() - Removed to avoid conflicts with Bootstrap
  ],

  vite: {
    resolve: {
      alias: {
        '@core': fileURLToPath(new URL('./core', import.meta.url)),
        '@user': fileURLToPath(new URL('./usr', import.meta.url)),
        '@components': fileURLToPath(new URL('./usr/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./usr/layouts', import.meta.url)),
        '@content': fileURLToPath(new URL('./usr/content', import.meta.url)),
      },
      dedupe: ['react', 'react-dom', '@tanstack/react-table'],
    },
  },
};

// Merge core config with user config
export default defineConfig({
  ...coreConfig,
  ...userConfig,
  
  // Deep merge integrations
  integrations: [
    ...coreConfig.integrations,
    ...(userConfig.integrations || []),
  ],
  
  // Deep merge vite config if user provides it
  vite: {
    ...coreConfig.vite,
    ...(userConfig.vite || {}),
    resolve: {
      ...coreConfig.vite.resolve,
      ...(userConfig.vite?.resolve || {}),
      alias: {
        ...coreConfig.vite.resolve.alias,
        ...(userConfig.vite?.resolve?.alias || {}),
      },
      dedupe: [
        ...(coreConfig.vite.resolve.dedupe || []),
        ...(userConfig.vite?.resolve?.dedupe || []),
      ],
    },
  },
});
// trigger reload
