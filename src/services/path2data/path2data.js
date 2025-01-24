import { withPrefix } from "gatsby"
import csv from "csvtojson"
import path2dataSourceProptypes from "./path2dataSourceProptypes"


const formatUrl = ({path}) => {
  return {
    sourceUrl: path.startsWith("http") ? path : withPrefix(path),
    options: {}
  }
}

const parseResponse = async (response, path) => {
  if (path.toLowerCase().endsWith(".csv")) {
    const csvText = await response.text()
    return await csv().fromString(csvText)
  }
  if (path.toLowerCase().endsWith(".geojson")) {
    return await response.json();
  }
}

const Path2DataService = {
  formatUrl: formatUrl,
  parseResponse: parseResponse
}

formatUrl.propTypes = path2dataSourceProptypes

export default Path2DataService
