const parseResponse = async response => {
  try {
    const output = await response.json()

    // Controlla se l'output è valido e contiene risultati
    if (!output || !Array.isArray(output) || output.length === 0) {
      console.warn("Nessun risultato trovato per la ricerca.")
      return [] // Restituisce un array vuoto senza lanciare errori
    }

    // Trasforma i dati
    const transformedData = output.map(item => {
      const { data, links } = item
      return {
        id: data.key, // Identificativo univoco
        title: data.title || "No title",
        authors: data.creators
          ? data.creators
              .map(
                creator =>
                  `${creator.firstName || ""} ${creator.lastName || ""}`,
              )
              .join(", ")
          : "No authors",
        date: data.date || "No date",
        publisher: data.publisher || "No publisher",
        place: data.place || "No place",
        tags: data.tags ? data.tags.map(tag => tag.tag).join(", ") : "No tags",
        url: links?.alternate?.href || "No URL",
        bookTitle: data.bookTitle || "No book title",
        abstractNote: data.abstractNote || "No abstract",
      }
    })

    return transformedData
  } catch (error) {
    console.error("Errore durante l'elaborazione della risposta Zotero:", error)
    return [] // Restituisce un array vuoto in caso di errore
  }
}

export default parseResponse
