const parseResponse = async (response) => {
  try {
    const output = await response.json();

    // 🔹 Se la risposta API è vuota, restituisce un array vuoto senza errori
    if (!output || (output.results && output.results.length === 0)) {
      console.warn("No result found");
      return [];
    }

    // 🔹 Determina i risultati di base (usa `results` per EDR)
    let allResults = output.results || output;

    // 🔹 Filtra i record che contengono "ignoratur", "Roma?"
    allResults = allResults.filter(item => {
      const loc = (item.localization?.discovery_location || "").toLowerCase();
      return !loc.includes("ignoratur") && !loc.includes("roma?");
    });

    // 🔹 Se dopo il filtro non rimangono risultati, mostra un avviso ma non genera un errore
    if (allResults.length === 0) {
      console.warn("No result found.");
      return [];
    }

    return allResults;
  } catch (error) {
    console.error("Errore durante il parsing della risposta API:", error);
    return []; // 🔹 Evita il crash restituendo un array vuoto
  }
};

export default parseResponse;
