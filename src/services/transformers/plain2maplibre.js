// Mapping of logical connectors from plain format to MapLibre expressions
const connector_map = {
  _and: "all",
  _or: "any",
}

/**
 * Transforms a plain filter object into a MapLibre-compatible expression.
 * https://maplibre.org/maplibre-style-spec/expressions/
 *
 * Handles null/undefined plain arrays safely by using (plain || []).
 * Supports various comparison, string matching, and null/empty check operators.
 *
 * @param {String} conn   Logical connector: _and or _or (maps to 'all' or 'any')
 * @param {Array} plain   Array of filter objects with 'field', 'operator', and 'value' keys
 * @returns {Array}       MapLibre Style Expression array
 */
const plain2maplibre = (conn, plain) => {
  const maplibre = []

  // Use the logical connector from the map (defaults to "any" if not found)
  const logicalConnector = connector_map[conn] || "any"
  maplibre.push(logicalConnector)

  // Handle null/undefined plain arrays safely
  (plain || []).forEach(el => {
    const operator = el.operator || "_eq" // Default to equality operator if not specified
    switch (operator) {
      case "_eq":
        maplibre.push(["==", ["get", el.field], ["literal", el.value]])
        break
      case "_neq":
        maplibre.push(["!=", ["get", el.field], ["literal", el.value]])
        break
      case "_lt":
        maplibre.push(["<", ["get", el.field], ["literal", el.value]])
        break
      case "_lte":
        maplibre.push(["<=", ["get", el.field], ["literal", el.value]])
        break
      case "_gt":
        maplibre.push([">", ["get", el.field], ["literal", el.value]])
        break
      case "_gte":
        maplibre.push([">=", ["get", el.field], ["literal", el.value]])
        break
      case "_in":
        maplibre.push(["in", ["get", el.field], ["literal", el.value]])
        break
      case "_nin":
        maplibre.push(["!in", ["get", el.field], ["literal", el.value]])
        break
      case "_icontains":
        maplibre.push([
          ">=",
          ["index-of", el.value.toLowerCase(), ["downcase", ["get", el.field]]],
          0,
        ])
        break
      case "_contains":
        maplibre.push([">=", ["index-of", el.value, ["get", el.field]], 0])
        break
      case "_ncontains":
        maplibre.push(["<", ["index-of", el.value, ["get", el.field]], 0])
        break
      case "_starts_with":
        maplibre.push([
          "==",
          ["slice", ["get", el.field], 0, el.value.length],
          ["literal", el.value],
        ])
        break
      case "_istarts_with":
        maplibre.push([
          "==",
          ["slice", ["downcase", ["get", el.field]], 0, el.value.length],
          ["literal", el.value.toLowerCase()],
        ])
        break
      case "_nstarts_with":
        maplibre.push([
          "!",
          ["==", ["slice", ["get", el.field], 0, el.value.length], el.value],
        ])
        break
      case "_nistarts_with":
        maplibre.push([
          "!",
          [
            "==",
            ["slice", ["downcase", ["get", el.field]], 0, el.value.length],
            el.value.toLowerCase(),
          ],
        ])
        break
      case "_ends_with":
        maplibre.push([
          "==",
          ["slice", ["get", el.field], -el.value.length],
          ["literal", el.value],
        ])
        break
      case "_iends_with":
        maplibre.push([
          "==",
          ["slice", ["downcase", ["get", el.field]], -el.value.length],
          ["literal", el.value.toLowerCase()],
        ])
        break
      case "_nends_with":
        maplibre.push([
          "!",
          ["==", ["slice", ["get", el.field], -el.value.length], el.value],
        ])
        break
      case "_niends_with":
        maplibre.push([
          "!",
          [
            "==",
            ["slice", ["downcase", ["get", el.field]], -el.value.length],
            el.value.toLowerCase(),
          ],
        ])
        break
      case "_empty":
        maplibre.push(["==", ["get", el.field], ""])
        break
      case "_nempty":
        maplibre.push(["!=", ["get", el.field], ""])
        break
      case "_null":
        maplibre.push(["==", ["get", el.field], null])
        break
      case "_nnull":
        maplibre.push(["!=", ["get", el.field], null])
        break
      default:
        // Fallback for unknown operators: use equality as default
        maplibre.push(["==", ["get", el.field], ["literal", el.value]])
        break
    }
  })

  return maplibre
}

export default plain2maplibre
