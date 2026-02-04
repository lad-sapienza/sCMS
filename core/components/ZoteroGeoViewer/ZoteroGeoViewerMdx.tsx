import type { ZoteroGeoViewerProps } from './types';
import { ZoteroGeoViewer } from './ZoteroGeoViewer';

/**
 * MDX-compatible wrapper for ZoteroGeoViewer
 * 
 * Usage in MDX files:
 * ```jsx
 * import { ZoteroGeoViewerMdx } from '@core/components/ZoteroGeoViewer';
 * 
 * <ZoteroGeoViewerMdx groupId={12345} layout="8x4" />
 * ```
 */
export function ZoteroGeoViewerMdx(props: ZoteroGeoViewerProps) {
  return <ZoteroGeoViewer {...props} />;
}