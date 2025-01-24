import csv from "csvtojson"
import json2geoJson from "./transformers/json2geojson.js"
import sourcePropTypes from "./sourcePropTypes.js"
import { withPrefix } from "gatsby"
import DirectusService from "./directus/directus.js"

const getDataFromSource = async ({
  path2data,
  directus,
  transType,
  geoField,
}) => {
  let sourceUrl
  let options = {}
  let output

  if (path2data) {
    sourceUrl = path2data.startsWith("http") ? path2data : withPrefix(path2data)
    if (path2data.toLowerCase().endsWith(".csv")) {
      transType = "csv2json"
    }
    if (path2data.toLowerCase().endsWith(".geojson")) {
      transType = "json"
    }
  } else if (directus) {
    const dirRet = DirectusService.formatUrl(directus)
    sourceUrl = dirRet.sourceUrl
    options = dirRet.options
  } else {
  }

  try {
    const response = await fetch(sourceUrl, options)

    if (directus){
      return await DirectusService.parseResponse(response, directus.geoField);
    }

    switch (transType) {
      case "text":
        output = await response.text()
        break

      case "csv2json":
        const csvText = await response.text()
        output = await csv().fromString(csvText)
        break

      case "geojson":
        const respJson = await response.json()
        output = json2geoJson(respJson.data, geoField)
        break

      case "json":
      default:
        output = await response.json()
        break
    }

    if (output.errors) {
      throw new Error(
        `Error communicating with server: ${output.errors[0].message}`,
      )
    }

    return Object.hasOwn(output, "data") ? output.data : output
  } catch (error) {
    // console.log(error)
    throw Error(error)
  }
}

getDataFromSource.PropTypes = sourcePropTypes

export default getDataFromSource
