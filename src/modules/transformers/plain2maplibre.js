// TODO: map all type of filters as defined in defaultOperators
const operator_map = {
  _eq: "==",
  _neq: "!=",
  _lt: "<",
  _lte: "<=",
  _gt: ">",
  _gte: ">=",
  _in: "in",
  _nin: "!in",
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

  // Supporto per operatori aggiuntivi in MapLibre
  plain.forEach(el => {
    switch (el.operator) {
      case "_null":
        maplibre.push(["==", ["get", el.field], null])
        break
      case "_nnull":
        maplibre.push(["!=", ["get", el.field], null])
        break
      case "_contains":
        maplibre.push(["index-of", el.value, ["get", el.field], ">=", 0])
        break
      case "_icontains":
        maplibre.push([
          "index-of",
          ["to-lower-case", ["get", el.field]],
          ["to-lower-case", el.value],
          ">=",
          0,
        ])
        break
      case "_ncontains":
        maplibre.push(["index-of", el.value, ["get", el.field], "<", 0])
        break
      case "_starts_with":
        maplibre.push(["match", ["get", el.field], `${el.value}*`, true, false])
        break
      case "_istarts_with":
        maplibre.push([
          "match",
          ["to-lower-case", ["get", el.field]],
          [`${el.value}*`],
          true,
          false,
        ])
        break
      case "_nstarts_with":
        maplibre.push(
          ["!match", ["get", el.field]],
          [`${el.value}*`],
          true,
          false,
        )
        break
      case "_nistarts_with":
        maplibre.push([
          "!match",
          ["to-lower-case", ["get", el.field]],
          [`${el.value}*`],
          true,
          false,
        ])
        break
      case "_ends_with":
        maplibre.push(["match", ["get", el.field], `*${el.value}`, true, false])
        break
      case "_iends_with":
        maplibre.push([
          "match",
          ["to-lower", ["get", el.field]],
          `*${el.value.toLowerCase()}`,
          true,
          false,
        ])
        break
      case "_nends_with":
        maplibre.push([
          "!match",
          ["to-lower", ["get", el.field]],
          `*${el.value.toLowerCase()}`,
          true,
          false,
        ])
        break
      case "_niends_with":
        maplibre.push([
          "!match",
          ["get", el.field],
          `*${el.value}`,
          true,
          false,
        ])
        break
      case "_empty":
        maplibre.push(["==", ["get", el.field], ""])
        break
      case "_nempty":
        maplibre.push(["!=", ["get", el.field], ""])
        break
      default:
        break
    }
  })

  return maplibre
}

export { plain2maplibre }
