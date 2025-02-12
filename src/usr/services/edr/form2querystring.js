import PropTypes from "prop-types";

/**
 * Transforms plain object to EDR API query syntax
 * and returns an object with the query string
 * @param {String} conn   "_and" o "_or" per combinare i filtri
 * @param {Array} plain   Array di oggetti con field, operator, e value
 * @returns {Object}      Query compatibile con l'API EDR
 */
const form2querystring = (conn, plain) => {
  const edrQuery = {};


  // 🔹 Se è una ricerca avanzata, applica gli operatori speciali per l'API EDR
  plain.forEach(({ field, operator, value }) => {
    if (field && value != null) {
      if (operator === "_gte") {
        edrQuery[field] = `>${value}`; // 🔹 Rimuove "=" extra
      } else if (operator === "_lte") {
        edrQuery[field] = `<${value}`; // 🔹 Rimuove "=" extra
      } else {
        edrQuery[field] = value; // Operatore di default "="
      }
    }
  });

  // 🔹 Se ci sono più filtri, unirli con AND o OR
  if (Object.keys(edrQuery).length > 1 && conn) {
    return { [conn]: edrQuery };
  }

  return edrQuery;
};

form2querystring.propTypes = {
  conn: PropTypes.string, // "_and" o "_or"
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
};

export default form2querystring;
