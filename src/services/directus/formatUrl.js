import { default as qs } from "query-string"
import form2querystring from "./form2querystring"

/**
 * Formats the URL and options for fetching data from Directus.
 *
 * @param {Object} source - The source configuration object.
 * @param {string} source.endPoint - The Directus API endpoint.
 * @param {string} source.table - The Directus table to query.
 * @param {string} [source.id] - Optional ID of the specific item to fetch.
 * @param {string} [source.queryString] - Optional query string to append to the URL.
 * @param {string} [source.token] - Optional authentication token.
 * @param {Object} [uiFilter] - Optional filter object to apply to the query.
 * @param {string} uiFilter.conn - The logical connector (_and or _or) for the filter.
 * @param {Array} uiFilter.inputs - The array of filter inputs.
 * @returns {Object} - An object containing the formatted URL and options.
 * @throws {Error} - Throws an error if required parameters are missing.
 */
const formatUrl = (source, uiFilter) => {
  let { endPoint, table, id, queryString, token } = source

  let ret = {
    sourceUrl: "",
    options: {},
  }

  // Input validations: checks for a proper endpoint
  if (!endPoint && !process.env.GATSBY_DIRECTUS_ENDPOINT) {
    throw new Error(
      "Either `endPoint` or env variable `GATSBY_DIRECTUS_ENDPOINT` are needed to work with Directus",
    )
  }

  // Input validations: checks for a proper table
  if (!table) {
    throw new Error(
      "Parameter `directus.table` is required to work with Directus",
    )
  }

  ret.sourceUrl = endPoint ? endPoint : process.env.GATSBY_DIRECTUS_ENDPOINT

  ret.sourceUrl += `${ret.sourceUrl.endsWith("/") ? "" : "/"}items/${table}`

  if (id) {
    ret.sourceUrl += `/${id}`
    queryString = "fields=*.*.*"
  }

  if (uiFilter) {
    const { conn, inputs } = uiFilter
    const paresedUiFilter = form2querystring(conn, inputs)

    if (!queryString) {
      queryString = qs.stringify({ filter: JSON.stringify(paresedUiFilter) })
    } else {
      const queryObj = queryString.parse(queryString)
      if (!queryObj.filter) {
        queryObj.filter = JSON.stringify(paresedUiFilter)
        queryString = qs.stringify(queryObj)
      } else {
        const mainFilterObj = JSON.parse(queryObj.filter)
        queryObj.filter = JSON.stringify({
          _and: [mainFilterObj, paresedUiFilter],
        })
        queryString = qs.stringify(queryObj)
      }
    }
  }

  ret.sourceUrl += `?${queryString ? queryString : ""}`

  const authToken = token ? token : process.env.GATSBY_DIRECTUS_TOKEN

  if (authToken) {
    ret.options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  }

  return ret
}

export default formatUrl
