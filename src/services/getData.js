import csv from "csvtojson"
import { Json2GeoJson } from "../modules/transformers"

/**
 *
 * @param {String} source required. Data source: can be a Directus endpont (complete with protocol, full path and table name), a path to a local file or a path to e remotelo accessible file
 * @param {Sting} token optional. Authentication token for services supporting Authetnication bearaer token
 * @param {String} transType Data transformation type. At present the following are supported: json, geojson, csv2json
 * @param {String} dGeoField Directus field containing geographical data
 * @returns
 */
const getData = async (source, token, transType, dGeoField) => {
  let output
  let options = {}

  if (token) {
    options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }
  try {
    const response = await fetch(source, options)

    switch (transType) {
      case "json":
        output = await response.json()
        break

      case "geojson":
        const respgeoJson = await response.json()
        output = Json2GeoJson(respgeoJson.data, dGeoField || "coordinates")
        break

      case "csv2json":
        const csvText = await response.text()
        output = await csv().fromString(csvText)
        break

      default:
        output = await response.text()
        break
    }

    return output
  } catch (error) {
    throw Error(`Cannot get data from ${source}`)
  }
}

export default getData
