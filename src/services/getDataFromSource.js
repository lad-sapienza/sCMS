import sourcePropTypes from "./sourcePropTypes.js"
import DirectusService from "./directus/directus.js"
import Path2DataService from "./path2data/path2data.js"
import uiFilterPropTypes from "./uiFilterPropTypes.js"

const getDataFromSource = async (source, uiFilter) => {
  const { path2data, directus, customApi } = source

  let sourceUrl
  let options = {}

  // path2data source
  if (path2data) {
    // TODO: nota per paginazione: path2data prende tutto, quindi niente paginazione
    const p2tRet = Path2DataService.formatUrl(path2data, uiFilter)
    sourceUrl = p2tRet.sourceUrl
    options = p2tRet.options
    // Directus source
  } else if (directus) {
    // TODO: nota per paginazione:
    // Directus usa la sinatassi: ?aggregate[count]=*&filter=... che restituisce una oggetto del tipo: {"data":[{"count":"n"}]}
    // eseguire qui una query di conta, prendere i risultati e restituirli come numero di pagine (tot risultati / limit se c'è e se non è -1 (= tutti), altrimenti 100)
    // poi eseguire la query vera e propria
    const dirRet = DirectusService.formatUrl(directus, uiFilter)
    sourceUrl = dirRet.sourceUrl
    options = dirRet.options

    // CustomApi source
  } else if (customApi && customApi.formatUrl) {
    const customRet = customApi.formatUrl(uiFilter)
    sourceUrl = customRet.sourceUrl
    options = customRet.options

  } else if (source.geojson) {
    // If the source is a GeoJSON object, return it directly
    return source.geojson
  } else {
    throw new Error("No valid source provided")
  }

  try {
    const response = await fetch(sourceUrl, options)

    if (directus) {
      // Qui deve essere restituito {pagina di pagine}
      return await DirectusService.parseResponse(response, directus.geoField)
    } else if (path2data) {
      return await Path2DataService.parseResponse(response, path2data.path)
    } else if (customApi && customApi.parseResponse) {
      return await customApi.parseResponse(response, source.geoField)
    }
  } catch (error) {
    // console.log(error)
    throw Error(error)
  }
}

getDataFromSource.propTypes = {
  source: sourcePropTypes,
  uiFilter: uiFilterPropTypes,
}

export default getDataFromSource
