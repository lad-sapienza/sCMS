import { describe, it, expect, vi } from 'vitest';
import { galleryIntegration, GALLERY_VIRTUAL_MODULE_ID } from '../galleryIntegration';

function getVitePlugin() {
  let capturedConfig: any;
  const updateConfig = vi.fn((config: any) => {
    capturedConfig = config;
  });

  const integration = galleryIntegration();
  const setupHook = integration.hooks?.['astro:config:setup'];
  expect(setupHook).toBeTypeOf('function');

  // @ts-expect-error - minimal fake hook params, only what the hook uses
  setupHook({ updateConfig });

  const plugin = capturedConfig.vite.plugins[0];
  return plugin;
}

describe('galleryIntegration', () => {
  it('registers a resolveId/load pair for the virtual module id', () => {
    const plugin = getVitePlugin();
    const resolved = plugin.resolveId(GALLERY_VIRTUAL_MODULE_ID);
    expect(resolved).toBe('\0' + GALLERY_VIRTUAL_MODULE_ID);
    expect(plugin.resolveId('some/other/id')).toBeUndefined();
  });

  it('generates a virtual module with one static glob per source root', () => {
    const plugin = getVitePlugin();
    const resolvedId = plugin.resolveId(GALLERY_VIRTUAL_MODULE_ID);
    const source = plugin.load(resolvedId);

    expect(source).toContain("import.meta.glob('/usr/pages/**/gallery/*.");
    expect(source).toContain("import.meta.glob('/usr/content/**/gallery/*.");
    expect(source).toContain("import.meta.glob('/usr/galleries/*/*.");
    expect(source).toContain("import.meta.glob('/usr/pages/**/gallery/captions.json'");
    expect(source).toContain("import.meta.glob('/usr/content/**/gallery/captions.json'");
    expect(source).toContain("import.meta.glob('/usr/galleries/*/captions.json'");

    // Every glob call must use { eager: true } — a lazy glob would return
    // dynamic import() functions instead of already-resolved image metadata.
    const globCallCount = (source.match(/import\.meta\.glob/g) || []).length;
    const eagerCount = (source.match(/\{\s*eager:\s*true\s*\}/g) || []).length;
    expect(eagerCount).toBe(globCallCount);
  });

  it('returns undefined for any id it does not own', () => {
    const plugin = getVitePlugin();
    expect(plugin.load('/some/unrelated/module.js')).toBeUndefined();
  });
});
