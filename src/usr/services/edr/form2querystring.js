import PropTypes from "prop-types"

/**
 * Transforms plain object to EDR API query syntax
 * and returns an object with the query string
 * @param {String} conn   one of the logic connectors "AND" or "OR"
 * @param {Array} plain  Array of objects with field, operator and value keys
 * @returns {Object}      Object with query compatible to EDR API
 */
const form2querystring = (conn, plain) => {
  const edrQuery = {}

  // Costruzione della query in base al connettore (AND/OR)
  if (plain.length === 1) {
    // Se c'è un solo filtro, usa il formato semplice
    edrQuery[plain[0].field] = plain[0].value
  } else {
    // Altrimenti, costruisce un array di filtri con il connettore specificato
    edrQuery[conn.toLowerCase()] = []
    plain.forEach(el => {
      edrQuery[conn.toLowerCase()].push({
        [el.field]: {
          [el.operator]: el.value,
        },
      })
    })
  }

  return edrQuery
}

form2querystring.propTypes = {
  conn: PropTypes.oneOf(["AND", "OR"]).isRequired,
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      operator: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
}

export default form2querystring
