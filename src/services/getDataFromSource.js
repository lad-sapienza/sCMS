import sourcePropTypes from "./sourcePropTypes.js"
import DirectusService from "./directus/directus.js"
import Path2DataService from "./path2data/path2data.js"

const getDataFromSource = async ({ path2data, directus, customApi }) => {
  let sourceUrl
  let options = {}

  // path2data source
  if (path2data) {
    const p2tRet = Path2DataService.formatUrl(path2data)
    sourceUrl = p2tRet.sourceUrl
    options = p2tRet.options
    // Directus source
  } else if (directus) {
    const dirRet = DirectusService.formatUrl(directus)
    sourceUrl = dirRet.sourceUrl
    options = dirRet.options

    // CustomApi source
  } else if (customApi && customApi.formatUrl) {
    const customRet = customApi.formatUrl()
    sourceUrl = customRet.sourceUrl
    options = customRet.options
  } else {
    throw new Error("No valid source provided")
  }

  try {
    const response = await fetch(sourceUrl, options)

    if (directus) {
      return await DirectusService.parseResponse(response, directus.geoField)
    } else if (path2data) {
      return await Path2DataService.parseResponse(response, path2data.path)
    } else if (customApi && customApi.parseResponse) {
      return await customApi.parseResponse(response, customApi.geoField)
    }
  } catch (error) {
    // console.log(error)
    throw Error(error)
  }
}

getDataFromSource.PropTypes = sourcePropTypes

export default getDataFromSource
