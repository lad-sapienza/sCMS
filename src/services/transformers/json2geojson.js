/**
 * Converts a JSON array to a GeoJSON FeatureCollection.
 *
 * @param {Array} json - The JSON array to convert.
 * @param {string} geoDataField - The field in the JSON objects that contains the geographic data.
 * @returns {Object} The GeoJSON FeatureCollection.
 */
const json2geoJson = (json, geoDataField) => {
  return {
    type: "FeatureCollection",
    features: json.map(item => ({
      type: "Feature",
      properties: item,
      geometry: {
        type: "Point",
        coordinates: [
          item[geoDataField].coordinates[0], // longitude
          item[geoDataField].coordinates[1], // latitude
        ],
      },
    })),
  }
}

export default json2geoJson