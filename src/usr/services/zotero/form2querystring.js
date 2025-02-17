import PropTypes from "prop-types"

/**
 * Transforms plain object to Zotero API query syntax
 * and returns an object with the query string
 * @param {String} conn   Logical connector (ignored for Zotero, single level filters only)
 * @param {Array} plain   Array of objects with field, operator, and value keys
 * @returns {Object}      Object with query parameters compatible with the Zotero API
 */
const form2querystring = (conn, plain) => {

  if (!plain || plain.length === 0) {
    return {}; // 🔹 Ritorna un oggetto vuoto se non ci sono filtri
  }

  const zoteroQuery = {}

  
  // 🔹 Applica gli operatori speciali per l'API EDR
  plain.forEach(({ field, operator, value }) => {
    zoteroQuery[field] = value; // 🔹 Operatore di default "="
  });


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
