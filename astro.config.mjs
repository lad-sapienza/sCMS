import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import rehypeSlug from 'rehype-slug';
import { unified } from '@astrojs/markdown-remark';
import { userConfig } from './usr/user.config.mjs';
import { scms } from './core/scms.ts';

const coreAlias = {
  '@core': fileURLToPath(new URL('./core', import.meta.url)),
  '@user': fileURLToPath(new URL('./usr', import.meta.url)),
  '@components': fileURLToPath(new URL('./usr/components', import.meta.url)),
  '@layouts': fileURLToPath(new URL('./usr/layouts', import.meta.url)),
  '@content': fileURLToPath(new URL('./usr/content', import.meta.url)),
};

const {
  rehypePlugins: userRehypePlugins,
  remarkPlugins: userRemarkPlugins,
  remarkRehype: userRemarkRehype,
  ...userMarkdownConfig
} = userConfig.markdown || {};

export default defineConfig({
  site: userConfig.site ?? 'https://scms.lad-sapienza.it/',
  base: userConfig.base,
  output: 'static',
  srcDir: fileURLToPath(new URL('./usr', import.meta.url)),
  publicDir: fileURLToPath(new URL('./usr/public', import.meta.url)),

  markdown: {
    ...userMarkdownConfig,
    processor: unified({
      remarkPlugins: [...(userRemarkPlugins || [])],
      rehypePlugins: [rehypeSlug, ...(userRehypePlugins || [])],
      ...(userRemarkRehype ? { remarkRehype: userRemarkRehype } : {}),
    }),
  },

  integrations: [
    ...scms(),
    ...(userConfig.integrations || []),
  ],

  vite: {
    ...(userConfig.vite || {}),
    esbuild: {
      target: 'es2022',
      ...(userConfig.vite?.esbuild || {}),
    },
    resolve: {
      ...(userConfig.vite?.resolve || {}),
      alias: {
        ...coreAlias,
        ...(userConfig.vite?.resolve?.alias || {}),
      },
    },
  },
});
