/**
 * Converts a JSON array to a GeoJSON FeatureCollection using the specified geometry field.
 *
 * Enhancements over the basic implementation:
 *
 * 1) Invalid/null input handling
 *    - Returns an empty FeatureCollection if `rows` is not an array.
 *    - Rows without usable geometry are filtered out (do not produce features).
 *
 * 2) Robust geometry parsing logic
 *    - Supports "simple" formats:
 *      * Objects with `coordinates: [lng, lat]`
 *      * Direct values as `[lng, lat]`
 *    - These are normalized to standard GeoJSON Point geometries.
 *
 * 3) Full GeoJSON geometry support (including lines/polygons)
 *    - If `geoDataField` contains a complete GeoJSON Geometry (`type` + `coordinates`),
 *      it is used as-is (Point, LineString, Polygon, Multi*, etc.).
 *
 * In all cases:
 * - The `geoDataField` is removed from `properties`, so geometry data
 *   lives only in `geometry` (standard GeoJSON convention).
 *
 * @param {Array<Object>} rows - Array of source records.
 * @param {string} geoDataField - Name of the field containing geographic data.
 * @returns {{ type: "FeatureCollection", features: Array<Object> }} GeoJSON FeatureCollection.
 */
const json2geojson = (rows, geoDataField) => {
  // Validate input: return empty FeatureCollection if rows is not an array
  if (!Array.isArray(rows)) {
    return { type: "FeatureCollection", features: [] }
  }

  const features = rows
    // Filter out rows without a geometry field
    .filter(r => r && r[geoDataField] != null)
    .map(r => {
      const g = r[geoDataField]
      let geometry = null

      // Case 1: Complete GeoJSON Geometry (Point, LineString, Polygon, Multi*, etc.)
      if (g && typeof g.type === "string" && Array.isArray(g.coordinates)) {
        // Use as-is: not forcing to Point, so lines/polygons are preserved
        geometry = g
      } else {
        // Normalize "simple" formats into a Point geometry

        // Case 2A: Object with { coordinates: [lng, lat] }
        if (
          g &&
          Array.isArray(g.coordinates) &&
          g.coordinates.length >= 2 &&
          typeof g.coordinates[0] === "number" &&
          typeof g.coordinates[1] === "number"
        ) {
          geometry = {
            type: "Point",
            coordinates: [g.coordinates[0], g.coordinates[1]],
          }
        }
        // Case 2B: Direct value as [lng, lat]
        else if (
          Array.isArray(g) &&
          g.length >= 2 &&
          typeof g[0] === "number" &&
          typeof g[1] === "number"
        ) {
          geometry = {
            type: "Point",
            coordinates: [g[0], g[1]],
          }
        }
      }

      // Skip row if we couldn't construct a valid geometry
      if (!geometry) return null

      // Remove geometry field from properties, keeping only logical attributes
      const { [geoDataField]: _omit, ...props } = r

      return {
        type: "Feature",
        properties: props,
        geometry,
      }
    })
    // Filter out rows that were transformed to null (invalid geometry)
    .filter(Boolean)

  return { type: "FeatureCollection", features }
}

export default json2geojson
