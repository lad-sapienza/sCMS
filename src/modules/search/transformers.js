/**
 * Transforms plain object to Directus Filter rule syntax
 * https://docs.directus.io/reference/filter-rules.html
 * @param {String} conn   one of the logic connectors _and and _or
 * @param {Array} plain  Array of objects with field, operator and value keys
 * @returns {Object}      Object with query compatible to Directus API
 */
const plain2directus = (conn, plain) => {
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

// TODO: map all type of filters as defined in defaultOperators
const operator_map = {
  _eq: "==",
  _neq: "!=",
  _lt: "<",
  _lte: "<=",
  _gt: ">",
  _gte: ">=",
  // "_in": "Is one of",
  // "_nin": "Is not one of",
  // _null: "TODO == null?",
  // _nnull: "TODO != null?",
  // _contains: "TODO: index-of > -1?",
  // _icontains: "TODO",
  // _ncontains: "TODO: index-of < 0",
  // _starts_with: "TODO",
  // _istarts_with: "TODO",
  // _nstarts_with: "TODO",
  // _nistarts_with: "TODO",
  // _ends_with: "TODO",
  // _iends_with: "TODO",
  // _nends_with: "TODO",
  // _niends_with: "TODO",
  // _empty: "TODO: == ''?",
  _nempty: "TODO: != ''",
}

const connector_map = {
  _and: "all",
  _or: "any",
}

/**
 * Transforms plain object to MapLibre Style Expressions syntax
 * https://maplibre.org/maplibre-style-spec/expressions/
 * @param {String} conn   one of the logic connectors _and and _or
 * @param {Array} plain  Array of objects with field, operator and value keys
 * @returns {Object}      Object with query compatible to Directus API
 */
const plain2maplibre = (conn, plain) => {
  const maplibre = []

  if (plain.length === 1) {
    maplibre.push(operator_map[plain[0].operator])
    maplibre.push(["get", plain[0].field])
    maplibre.push(plain[0].value)
  } else {
    maplibre.push(connector_map[conn])
    plain.forEach((el, i) => {
      maplibre.push([operator_map[el.operator], ["get", el.field], el.value])
    })
  }
  return maplibre
}

export { plain2directus, plain2maplibre }
