import PropTypes from 'prop-types'
/**
 * Transforms plain object to Directus Filter rule syntax
 * https://docs.directus.io/reference/filter-rules.html
 * @param {String} conn   one of the logic connectors _and and _or
 * @param {Array} plain  Array of objects with field, operator and value keys
 * @returns {Object}      Object with query compatible to Directus API
 */
const form2querystring = (conn, plain) => {
  const directus = {}

  if (plain.length === 1) {
    directus[plain[0].field] = {
      [plain[0].operator]: plain[0].value,
    }
  } else {
    directus[conn] = []
    plain.forEach((el, i) => {
      directus[conn].push({
        [el.field]: {
          [el.operator]: el.value,
        },
      })
    })
  }

  return directus
}

form2querystring.propTypes = {
  conn: PropTypes.oneOf(['_and', '_or']).isRequired,
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      operator: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
}

export default form2querystring
