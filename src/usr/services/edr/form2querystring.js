import PropTypes from "prop-types";

/**
 * Transforms plain object to EDR API query syntax
 * and returns an object with the query string
 * @param {String} conn   Ignorato, l'API usa "&" come operatore di default
 * @param {Array} plain   Array di oggetti con field, operator, e value
 * @returns {Object}      Query compatibile con l'API EDR
 */
const form2querystring = (conn, plain) => {
  if (!plain || plain.length === 0) {
    return {}; // 🔹 Ritorna un oggetto vuoto se non ci sono filtri
  }

  const edrQuery = {};

  // 🔹 Applica gli operatori speciali per l'API EDR
  plain.forEach(({ field, operator, value }) => {
    if (field && value != null) {
      if (operator === "_gte") {
        edrQuery[field] = `>${value}`;
      } else if (operator === "_lte") {
        edrQuery[field] = `<${value}`;
      } else {
        edrQuery[field] = value; // 🔹 Operatore di default "="
      }
    }
  });

  return edrQuery;
};

form2querystring.propTypes = {
  conn: PropTypes.string, // Ignorato, non necessario
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
};

export default form2querystring;
