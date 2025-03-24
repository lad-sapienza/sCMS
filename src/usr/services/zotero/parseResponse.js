import json2geoJson from "../../../services/transformers/json2geojson"

/**
 * Enriches Zotero items with coordinates by matching tags with ontology names,
 * and applies json2geoJson if geoField is provided.
 *
 * @param {Response} response - fetch() response from Zotero API
 * @param {string|null} geoField - Name of the geometry field (e.g., "geometry")
 * @returns {Array|GeoJSON} - FeatureCollection or enriched array
 */
export default async function parseResponse(response, geoField) {
  console.log("🛰️ parseResponse → geoField ricevuto:", geoField)

  try {
    const output = await response.json()
    if (!Array.isArray(output) || output.length === 0) {
      console.warn("Nessun risultato trovato.")
      return []
    }

    if (!geoField) {
      return output.map(item => {
        const { data, links } = item
        return {
          id: data.key,
          title: data.title || "No title",
          authors: data.creators
            ? data.creators
                .map(c => `${c.firstName || ""} ${c.lastName || ""}`.trim())
                .join(", ")
            : "No authors",
          date: data.date || "No date",
          publisher: data.publisher || "No publisher",
          place: data.place || "No place",
          tags: data.tags ? data.tags.map(t => t.tag).join(", ") : "No tags",
          url: links?.alternate?.href || "No URL",
          bookTitle: data.bookTitle || "No book title",
          abstractNote: data.abstractNote || "No abstract",
        }
      })
    }

    // Carica ontologia
    const ontology = await fetch("/data/ontologia.geojson").then(r => r.json())
    const features = ontology.features || []
    console.log(`📚 Ontologia caricata: ${features.length} features`)

    const getGeometryAndToponym = tags => {
      if (!Array.isArray(tags)) return { geometry: null, toponym: null, matchedTag: null }

      const tagStrings = tags
        .map(t => t.tag.trim())
        .filter(tag => tag.startsWith("@"))
        .map(tag => tag.replace(/^@/, "").toLowerCase())

      for (const tag of tagStrings) {
        for (const feature of features) {
          const rawAltLabels = feature.properties?.altLabel || ""
          const altLabels = typeof rawAltLabels === "string"
            ? rawAltLabels.split(",").map(s => s.trim().toLowerCase())
            : []

          const name = feature.properties?.name?.toLowerCase().replace(/^@/, "").trim()
          const allNames = [name, ...altLabels].filter(Boolean)

          if (allNames.includes(tag)) {
            return {
              geometry: feature.geometry,
              toponym: feature.properties.name || null,
              matchedTag: "@" + tag, // con @ per coerenza con Zotero
            }
          }
        }
      }

      return { geometry: null, toponym: null, matchedTag: null }
    }

    const enrichedItems = output.map(item => {
      const { data, links } = item
      const { geometry, toponym, matchedTag } = getGeometryAndToponym(data.tags)

      return {
        id: data.key,
        title: data.title || "No title",
        authors: data.creators
          ? data.creators
              .map(c => `${c.firstName || ""} ${c.lastName || ""}`.trim())
              .join(", ")
          : "No authors",
        date: data.date || "No date",
        publisher: data.publisher || "No publisher",
        place: data.place || "No place",
        tags: matchedTag || "No tags", // solo il tag che ha fatto match
        url: links?.alternate?.href || "No URL",
        bookTitle: data.bookTitle || "No book title",
        abstractNote: data.abstractNote || "No abstract",
        [geoField]: geometry || null,
        toponym: toponym || null,
      }
    })

    const geojson = json2geoJson(enrichedItems, geoField)
    console.log("GeoJSON Finale:", geojson)
    return geojson

  } catch (err) {
    console.error("Errore in parseResponse:", err)
    return []
  }
}
