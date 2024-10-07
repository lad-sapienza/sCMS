import PropTypes from "prop-types"
import csv from "csvtojson"
import { json2geoJson } from "../modules/transformers"

const getData = async ({
  path2data,

  dEndPoint,
  dToken,

  dTable,
  id,
  dQueryString,

  transType,
  geoField,
}) => {
  let source
  let options = {}
  let output

  if (path2data) {
    source = path2data
    if (path2data.toLowerCase().endsWith(".csv")) {
      transType = "csv2json"
    }
    if (path2data.toLowerCase().endsWith(".geojson")) {
      transType = "json"
    }
  } else {
    if (dEndPoint) {
      source = dEndPoint
    } else if (process.env.GATSBY_DIRECTUS_ENDPOINT && dTable) {
      source = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${dTable}`
    } else {
      console.log(path2data)
      throw new Error(
        "Either `dEndPoint` or env variable `GATSBY_DIRECTUS_ENDPOINT` AND `dTable` are needed",
      )
    }
    if (id){
      source += `/${id}`
    } else {
      source += `?${dQueryString ? dQueryString : ""}`
    }

    const token = dToken ? dToken : process.env.GATSBY_DIRECTUS_TOKEN

    if (token) {
      options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
  }

  try {
    const response = await fetch(source, options)

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

    if (output.errors){
      throw new Error(`Error communicating with server: ${output.errors[0].message}`);
    }

    return Object.hasOwn(output, 'data') ? output.data : output
  } catch (error) {
    // console.log(error)
    throw Error(error)
  }
}

getData.PropTypes = {
  path2data: PropTypes.string,
  dEndPoint: PropTypes.string,
  dToken: PropTypes.string,
  dTable: PropTypes.string,
  id: PropTypes.number,
  dQueryString: PropTypes.string,
  transType: PropTypes.oneOf(["text", "csv2json", "json", "geojeson"]),
}

export default getData
