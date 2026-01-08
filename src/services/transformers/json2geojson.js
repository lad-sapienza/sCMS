/**
 * Converte un array JSON in una GeoJSON FeatureCollection, usando il campo `geoDataField`.
 *
 * FIX 1 – Cosa fa in più rispetto alla versione originale:
 *
 * 1) Gestione input non validi / null
 *    - Se `rows` non è un array, restituisce una FeatureCollection vuota.
 *    - Le righe senza una geometria utilizzabile vengono scartate (non producono feature).
 *
 * 2) Logica di recupero geometrie più robusta
 *    - Supporta formati "semplici":
 *      * oggetti con `coordinates: [lng, lat]`
 *      * valori direttamente `[lng, lat]`
 *    - In questi casi costruisce un Point standard.
 *
 * 3) Supporto a geometrie GeoJSON complete (anche linee/poligoni)
 *    - Se `geoDataField` contiene una Geometry GeoJSON completa (`type` + `coordinates`),
 *      la usa così com'è (Point, LineString, Polygon, Multi*, ecc.).
 *
 * In tutti i casi:
 * - Il campo `geoDataField` viene rimosso da `properties`, così la geometria
 *   vive solo in `geometry` (convenzione GeoJSON standard).
 *
 * @param {Array<Object>} rows - Array di record sorgente.
 * @param {string} geoDataField - Nome del campo che contiene i dati geografici.
 * @returns {{ type: "FeatureCollection", features: Array<Object> }} GeoJSON FeatureCollection.
 */
const json2geojson = (rows, geoDataField) => {
  // FIX 1 (parte 1): se l'input non è un array, evita errori e restituisce una FeatureCollection vuota
  if (!Array.isArray(rows)) {
    return { type: "FeatureCollection", features: [] }
  }

  const features = rows
    // FIX 1 (parte 1): scarta subito le righe senza il campo geometria
    .filter(r => r && r[geoDataField] != null)
    .map(r => {
      const g = r[geoDataField]
      let geometry = null

      // FIX 1 (parte 3): caso 1 — Geometry GeoJSON completa (Point, LineString, Polygon, Multi*, ecc.)
      if (g && typeof g.type === "string" && Array.isArray(g.coordinates)) {
        // Usata così com'è: non forziamo a Point, quindi passano anche linee/poligoni
        geometry = g
      } else {
        // FIX 1 (parte 2): normalizzazione dei formati "semplici" in un Point

        // Caso 2A: oggetto con { coordinates: [lng, lat] }
        if (
          g &&
          Array.isArray(g.coordinates) &&
          g.coordinates.length >= 2 &&
          typeof g.coordinates[0] === "number" &&
          typeof g.coordinates[1] === "number"
        ) {
          geometry = {
            type: "Point",
            coordinates: [g.coordinates[0], g.coordinates[1]],
          }
        }
        // Caso 2B: valore direttamente [lng, lat]
        else if (
          Array.isArray(g) &&
          g.length >= 2 &&
          typeof g[0] === "number" &&
          typeof g[1] === "number"
        ) {
          geometry = {
            type: "Point",
            coordinates: [g[0], g[1]],
          }
        }
      }

      // FIX 1 (parte 1): se non siamo riusciti a costruire una geometria valida, salta la riga
      if (!geometry) return null

      // Rimuove il campo geometria dalle properties, lasciando solo gli attributi "logici"
      const { [geoDataField]: _omit, ...props } = r

      return {
        type: "Feature",
        properties: props,
        geometry,
      }
    })
    // Elimina le righe trasformate in null (geometria non valida)
    .filter(Boolean)

  return { type: "FeatureCollection", features }
}

export default json2geojson
