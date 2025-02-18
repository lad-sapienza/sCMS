import json2geoJson from "../transformers/json2geojson"

const parseResponse = async (response, geoField) => {
  const output = await response.json()

  if (geoField) {
    output.data = json2geoJson(output.data, geoField)
  }
  return output.data
}

export default parseResponse