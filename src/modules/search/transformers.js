/**
 * Transforms plain object to Directus Filter rule syntax
 * https://docs.directus.io/reference/filter-rules.html
 * @param {String} conn   one of the logic connectors _and and _or
 * @param {Array} plain  Array of objects with field, operator and value keys
 * @returns {Object}      Object with query compatible to Directus API
 */
const plain2directus = (conn, plain) => {
  const directus = {
    filter: {},
  }

  if (plain.length === 1) {
    directus.filter[plain[0].field] = {
      [plain[0].operator]: plain[0].value,
    }
  } else {
    directus.filter[conn] = []
    plain.forEach((el, i) => {
      directus.filter[conn].push({
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
