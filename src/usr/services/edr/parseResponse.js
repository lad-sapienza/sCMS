const parseResponse = async response => {
  try {
    // Parsing della risposta JSON dall'API EDR
    const output = await response.json()

    // L'API EDR restituisce i dati nei campi specifici
    if (!output.results || output.results.length === 0) {
      throw new Error("La risposta dell'API EDR non contiene risultati.")
    }
    return output.results
  } catch (error) {
    console.error("Errore durante l'elaborazione della risposta EDR:", error)
    throw new Error("Errore nel parsing della risposta EDR.")
  }
}

export default parseResponse
