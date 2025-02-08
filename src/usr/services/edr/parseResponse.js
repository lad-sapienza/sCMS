const parseResponse = async response => {
  try {
    // Parsing della risposta JSON dall'API EDR
    const output = await response.json();

    // L'API EDR restituisce i dati nei campi specifici
    if (!output.results || output.results.length === 0) {
      throw new Error("La risposta dell'API EDR non contiene risultati.");
    }

    // 1. Ottengo i risultati di base
    let allResults = output.results;

    // 2. Filtro i record che contengono "ignoratur" o "Roma?" in discovery_location
    allResults = allResults.filter(item => {
      const loc = (item.localization?.discovery_location || "").toLowerCase();
      // Escludiamo se contiene "ignoratur" O se contiene "roma?"
      // => manteniamo solo quelli che NON contengono nessuno dei due
      return !loc.includes("ignoratur") && !loc.includes("roma?");
    });

    // 3. Se dopo il filtro è vuoto => errore => "No results"
    if (allResults.length === 0) {
      throw new Error("Dopo il filtro 'ignoratur'/'Roma?' non rimangono risultati.");
    }

    // Ritorno i risultati finali filtrati
    return allResults;
  } catch (error) {
    console.error("Errore durante l'elaborazione della risposta EDR:", error);
    throw new Error("Errore nel parsing della risposta EDR.");
  }
};

export default parseResponse;

