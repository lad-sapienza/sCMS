const parseResponse = async response => {
  try {
    const output = await response.json()

    if (!output || output.length === 0) {
      throw new Error("La risposta dell'API Zotero non contiene risultati.")
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
    throw new Error("Errore nel parsing della risposta Zotero.")
  }
}

export default parseResponse
