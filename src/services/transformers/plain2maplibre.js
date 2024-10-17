// Mappa degli operatori da Directus a MapLibre
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

// Mappa dei connettori logici
const connector_map = {
  _and: "all",
  _or: "any",
}

/**
 * Trasforma un plain object in una espressione compatibile con MapLibre
 * https://maplibre.org/maplibre-style-spec/expressions/
 * @param {String} conn   uno dei connettori logici: _and o _or
 * @param {Array} plain   Array di oggetti con chiavi 'field', 'operator' e 'value'
 * @returns {Array}       Array compatibile con MapLibre Style Expression
 */

const plain2maplibre = (conn, plain) => {
  const maplibre = []

  if (plain.length === 1) {
    maplibre.push(operator_map[plain[0].operator] || "==")
    maplibre.push(["get", plain[0].field])
    maplibre.push(plain[0].value)
  } else {
    maplibre.push(connector_map[conn] || "any")
    plain.forEach(el => {
      const operator = el.operator || "_icontains" // Default a _icontains se non specificato

      switch (operator) {
        case "_icontains":
          // Usa index-of per ricerca parziale case-insensitive
          maplibre.push([
            ">=",
            [
              "index-of",
              el.value.toLowerCase(),
              ["downcase", ["get", el.field]],
            ],
            0,
          ])
          break
        case "_ncontains":
          // Usa index-of per escludere stringhe che contengono il valore
          maplibre.push([
            "<",
            [
              "index-of",
              el.value.toLowerCase(),
              ["downcase", ["get", el.field]],
            ],
            0,
          ])
          break
        case "_starts_with":
          // Cerca stringhe che iniziano con il valore
          maplibre.push([
            "==",
            ["slice", ["get", el.field], 0, el.value.length],
            el.value,
          ])
          break
        case "_ends_with":
          // Cerca stringhe che terminano con il valore
          maplibre.push([
            "==",
            ["slice", ["get", el.field], -el.value.length],
            el.value,
          ])
          break
        case "_empty":
          maplibre.push(["==", ["get", el.field], ""])
          break
        case "_nempty":
          maplibre.push(["!=", ["get", el.field], ""])
          break
        default:
          maplibre.push([
            operator_map[operator] || "==",
            ["get", el.field],
            el.value,
          ])
          break
      }
    })
  }

  return maplibre
}

export default plain2maplibre
