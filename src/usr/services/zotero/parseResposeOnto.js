import mapBiblio2Onto from "./mapBiblio2Onto"

/**
 * parseResponseOnto
 *
 * @param {Response} response - la risposta fetch() dall'API di Zotero
 * @param {Object} [uiFilter={}] - eventuali filtri (es. q, tag) passati dal form di ricerca
 * @returns {Object} - FeatureCollection GeoJSON con la bibliografia annessa ai luoghi
 */
export default async function parseResponseOnto(response, uiFilter = {}) {
  try {
    // 1) Legge e verifica i dati di Zotero
    const output = await response.json()
    if (!Array.isArray(output) || output.length === 0) {
      console.warn("Nessun risultato trovato per la ricerca Zotero.")
      return {
        type: "FeatureCollection",
        features: [],
      }
    }

    // 2) Normalizza i record bibliografici di Zotero in un array "biblioData"
    let biblioData = output.map(item => {
      const { data, links } = item
      return {
        // Info base per la bibliografia
        key: data.key,
        title: data.title || "No title",
        authors: data.creators
          ? data.creators
              .map(c => `${c.firstName || ""} ${c.lastName || ""}`.trim())
              .join(", ")
          : "",
        date: data.date || "",
        tags: data.tags ? data.tags.map(t => t.tag) : [],
        url: links?.alternate?.href || "",
        abstractNote: data.abstractNote || "",
      }
    })

    // 3) Applica i filtri di ricerca (se "uiFilter.q" e/o "uiFilter.tag" sono valorizzati)
    if (uiFilter.q || uiFilter.tag) {
      biblioData = applySearchFilters(biblioData, uiFilter)
    }

    // 4) Carica l'ontologia (file .geojson) per la fusione
    const ontology = await fetch("/data/ontologia.geojson").then(r => r.json())

    // 5) Unisce la bibliografia con l’ontologia (aggiunge biblio in properties)
    const featureCollection = mapBiblio2Onto(biblioData, ontology)
    // featureCollection = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       geometry: {...},
    //       properties: {
    //         name: "...",
    //         altLabel: "...",
    //         biblio: [ { key, title, authors, ...}, ... ]
    //       }
    //     },
    //     ...
    //   ]
    // }

    // 6) Restituisce il FeatureCollection finale, pronto per la mappa
    return featureCollection
  } catch (error) {
    console.error("Errore in parseResponseOnto:", error)
    // Restituisce comunque un FeatureCollection vuoto per evitare crash
    return {
      type: "FeatureCollection",
      features: [],
    }
  }
}

/**
 * Esempio di funzione di filtraggio.
 * - Confronta la query `uiFilter.q` con title, authors e abstractNote
 * - Confronta `uiFilter.tag` con l'array di tags
 */
function applySearchFilters(items, uiFilter) {
  let { q, tag } = uiFilter
  if (!q && !tag) return items

  // Normalizza in minuscolo
  q = q?.toLowerCase() || ""
  tag = tag?.toLowerCase() || ""

  return items.filter(item => {
    // Verifica testo libero (q)
    const matchQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.authors.toLowerCase().includes(q) ||
      item.abstractNote.toLowerCase().includes(q)

    // Verifica tag
    const matchTag = !tag || item.tags.some(t => t.toLowerCase().includes(tag))

    return matchQ && matchTag
  })
}
