const Json2GeoJson = (json, geoDataField) => {
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

export {Json2GeoJson};