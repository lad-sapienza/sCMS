import PropTypes from "prop-types"

/**
 * Transforms plain object to Zotero API query syntax
 * and returns an object with the query string
 * @param {String} conn   Logical connector (ignored for Zotero, single level filters only)
 * @param {Array} plain   Array of objects with field, operator, and value keys
 * @returns {Object}      Object with query parameters compatible with the Zotero API
 */
const form2querystring = (conn, plain) => {
  const zoteroQuery = {}

  // Aggiungi i filtri specifici definiti in `plain`
  plain.forEach(el => {
    if (el.field === "q") {
      // Aggiungi ricerca rapida
      zoteroQuery.q = el.value
    } else if (el.field === "tag") {
      // Filtra per tag
      zoteroQuery.tag = el.value
    } else if (el.field === "since") {
      // Filtra per versione modificata
      zoteroQuery.since = el.value
    } else {
      // Aggiungi altri filtri generici
      zoteroQuery[el.field] = el.value
    }
  })

  return zoteroQuery
}

form2querystring.propTypes = {
  conn: PropTypes.oneOf(["AND", "OR"]), // Il connettore è ignorato per Zotero
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired, // Nome del campo
      operator: PropTypes.string, // Ignorato per Zotero
      value: PropTypes.any.isRequired, // Valore del filtro
    }),
  ).isRequired,
}

export default form2querystring
