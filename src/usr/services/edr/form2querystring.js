import PropTypes from "prop-types"

/**
 * Transforms plain object to EDR API query syntax
 * and returns an object with the query string
 * @param {String} conn   Ignored for EDR API as it does not support OR/AND
 * @param {Array} plain   Array of objects with field and value keys
 * @returns {Object}      Object with query compatible to EDR API
 */
const form2querystring = (conn, plain) => {
  const edrQuery = {}

  // Se il plain array è vuoto, ritorna un oggetto vuoto
  if (!plain || plain.length === 0) {
    return edrQuery
  }

  // Gestione dei filtri: solo field e value (senza operatori)
  plain.forEach(({ field, value }) => {
    if (field && value != null) {
      edrQuery[field] = value // Aggiungi il filtro direttamente come key-value
    }
  })

  return edrQuery
}

form2querystring.propTypes = {
  conn: PropTypes.string, // Ignorato per l'API EDR
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
}

export default form2querystring
