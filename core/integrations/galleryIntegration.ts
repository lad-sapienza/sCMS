/**
 * galleryIntegration
 *
 * Registers the virtual module `virtual:scms/galleries`, which holds the
 * import.meta.glob() calls the Gallery component needs to auto-load images.
 *
 * Vite requires import.meta.glob patterns to be static string literals in the
 * file that calls them — a plain relative pattern shipped inside a
 * node_modules/ package would resolve against the package's own folder, never
 * the consumer project's. Because this module's source is generated here
 * (not shipped verbatim as part of the component), the literal lives in code
 * Vite parses fresh in the consumer's own build, satisfying that requirement.
 * Verified empirically (2026-08-22): a generated virtual module's glob still
 * goes through Astro's image pipeline (hashed src + width/height), not just
 * raw strings — see project memory for the prototype that confirmed this.
 */
import type { AstroIntegration } from 'astro';

export const GALLERY_VIRTUAL_MODULE_ID = 'virtual:scms/galleries';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + GALLERY_VIRTUAL_MODULE_ID;

const IMAGE_EXTENSIONS = '{jpg,jpeg,png,gif,webp,avif,JPG,JPEG,PNG,GIF,WEBP,AVIF}';

export const GALLERY_VIRTUAL_MODULE_SOURCE = `
export const pagesImages = import.meta.glob('/usr/pages/**/gallery/*.${IMAGE_EXTENSIONS}', { eager: true });
export const contentImages = import.meta.glob('/usr/content/**/gallery/*.${IMAGE_EXTENSIONS}', { eager: true });
export const sharedImages = import.meta.glob('/usr/galleries/*/*.${IMAGE_EXTENSIONS}', { eager: true });
export const pagesCaptions = import.meta.glob('/usr/pages/**/gallery/captions.json', { eager: true });
export const contentCaptions = import.meta.glob('/usr/content/**/gallery/captions.json', { eager: true });
export const sharedCaptions = import.meta.glob('/usr/galleries/*/captions.json', { eager: true });
`;

export function galleryIntegration(): AstroIntegration {
  return {
    name: 'scms-gallery',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'scms-gallery-virtual-module',
                resolveId(id: string) {
                  if (id === GALLERY_VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
                },
                load(id: string) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) return GALLERY_VIRTUAL_MODULE_SOURCE;
                },
              },
            ],
          },
        });
      },
    },
  };
}
