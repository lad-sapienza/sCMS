import form2querystring from "./form2querystring"

/**
 * Formats the URL and options for fetching data from the Zotero API.
 *
 * @param {Object} [uiFilter={}] - The filter object to apply to the query.
 * @param {string} [uiFilter.conn="_and"] - The logical connector (_and or _or) for the filter.
 * @param {Array} [uiFilter.inputs=[]] - The array of filter inputs.
 * @returns {Object} - An object containing the formatted URL (`sourceUrl`) and the fetch options.
 */
const formatUrl = (uiFilter = {}) => {
  // Destruttura conn e inputs con valori di fallback
  const { conn = "_and", inputs = [] } = uiFilter

  let ret = {
    sourceUrl: "https://api.zotero.org/groups/336647/items",
    options: {
      headers: {
        "Content-Type": "application/json",
        "Zotero-API-Version": "3",
      },
    },
  }

  // Usa form2querystring per generare i parametri di query in base a conn e inputs
  const filter = form2querystring(conn, inputs)

  if (filter && typeof filter === "object") {
    // Serializza i parametri in una query string
    const serializedQuery = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    // Aggiungi i parametri all'URL
    ret.sourceUrl += `?${serializedQuery}`
  }

  return ret
}

export default formatUrl
