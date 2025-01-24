import PropTypes from "prop-types"

const formatUrl = ({ endPoint, query, token }) => {
  // Imposta valori di default
  const defaultEndPoint =
    "http://www.edr-edr.it/edr_programmi/edr_api.php?ancient_city=roma"

  let ret = {
    sourceUrl: "",
    options: {},
  }

  // Usa `endPoint` passato o un valore di default
  ret.sourceUrl = endPoint || defaultEndPoint

  // Serializza la query string
  if (query && typeof query === "object") {
    const serializedQuery = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")
    ret.sourceUrl += `&${serializedQuery}`
  }

  // Aggiunge il token di autenticazione, se presente
  if (token) {
    ret.options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  return ret
}

formatUrl.propTypes = {
  endPoint: PropTypes.string, // Endpoint opzionale
  query: PropTypes.object.isRequired, // Oggetto query, ad esempio { record_number: "EDR000001" }
  token: PropTypes.string, // Token opzionale
}

export default formatUrl
