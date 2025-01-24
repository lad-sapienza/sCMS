import json2geoJson from "./transformers/json2geojson.js"
import sourcePropTypes from "./sourcePropTypes.js"
import DirectusService from "./directus/directus.js"
import Path2DataService from "./path2data/path2data.js"

const getDataFromSource = async ({
  path2data,
  directus,
  customApi,
  transType,
  geoField,
}) => {
  let sourceUrl
  let options = {}
  let output

  // path2data source
  if (path2data) {
    const p2tRet = Path2DataService.formatUrl(path2data);
    sourceUrl = p2tRet.sourceUrl
    options = p2tRet.options
  // Directus source
  } else if (directus) {
    const dirRet = DirectusService.formatUrl(directus)
    sourceUrl = dirRet.sourceUrl
    options = dirRet.options
  
  // CustomApi source
  } else  if (customApi && customApi.formatUrl) {
    const customRet = customApi.formatUrl()
    sourceUrl = customRet.sourceUrl
    options = customRet.options
  } else {
    throw new Error("No valid source provided")
  }

  try {
    const response = await fetch(sourceUrl, options)

    if (directus){
      return await DirectusService.parseResponse(response, directus.geoField);
    
    } else if (path2data) {
      return await Path2DataService.parseResponse(response, path2data.path)
    
    } else if (customApi && customApi.parseResponse) {
      return await customApi.parseResponse(response, customApi.geoField)
    }

    switch (transType) {
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
