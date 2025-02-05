/**
 * parseResponse - Scarica tutti i risultati EDR con paginazione `&start=...`,
 * unisce i record in un array e filtra i risultati contenenti "ignoratur" in `discovery_location`.
 *
 * @param {Response} response - Prima risposta già fetchata da getDataFromSource (relativa a ?start=0).
 * @param {string} [geoField] - Parametro inattivo qui, ma presente in getDataFromSource.
 * @returns {Array} - Un array con tutti i risultati filtrati.
 */
const parseResponse = async (response, geoField) => {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Base URL della prima risposta (potrebbe contenere &start=0, se l'hai messo in formatUrl)
    const baseUrl = response.url;
    console.log("[parseResponse] baseUrl:", baseUrl);

    // Decodifico la prima risposta
    let data = await response.json();
    console.log("[parseResponse] first data:", data);

    // Unisci i risultati in un array
    let allResults = data?.results || [];

    // Se la lunghezza è 0, lancia eccezione => "No results"
    if (allResults.length === 0) {
      throw new Error("La risposta dell'API EDR non contiene risultati.");
    }

    // Leggo il parametro start dall'URL. Se assente, assumo 0
    let start = getStartParam(baseUrl) || 0;

    // Se l'API restituisce blocchi di 100 e c'è una prossima pagina
    // puoi usare la logica: while (data.results.length === 100)
    while (data.results && data.results.length === 100) {
      start += 100;
      const nextUrl = setStartParam(baseUrl, start);

      console.log("[parseResponse] fetching next page:", nextUrl);
      const nextResp = await fetch(nextUrl);
      if (!nextResp.ok) {
        console.warn(`[parseResponse] HTTP Error fetching ${nextUrl}`);
        break;
      }
      data = await nextResp.json();

      if (!data?.results?.length) {
        console.log("[parseResponse] no more results in next page");
        break;
      }

      console.log(`[parseResponse] page start=${start}, results:`, data.results.length);
      allResults = allResults.concat(data.results);
    }

    // Filtro i risultati per escludere 'ignoratur' in discovery_location
    allResults = allResults.filter((item) => {
      const location = String(item.localization?.discovery_location || "").toLowerCase();
      // Escludi i record che contengono "ignoratur"
      return !location.includes("ignoratur")&& !location.includes("roma?");
    });

    // Se dopo il filtro è vuoto, lancia eccezione => "No results"
    if (allResults.length === 0) {
      throw new Error(
        "La risposta dell'API EDR non contiene risultati dopo aver filtrato 'ignoratur'."
      );
    }

    return allResults;
  } catch (error) {
    console.error("Errore durante l'elaborazione della risposta EDR:", error);
    throw new Error("Errore nel parsing della risposta EDR.");
  }
};

/**
 * getStartParam - Estrae il parametro &start=N da una URL
 */
function getStartParam(url) {
  const match = url.match(/[?&]start=(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

/**
 * setStartParam - Sostituisce o aggiunge &start=N in baseUrl
 */
function setStartParam(baseUrl, start) {
  if (baseUrl.includes("start=")) {
    // Sostituisco start=? con start=nuovo
    return baseUrl.replace(/start=\d+/, `start=${start}`);
  } else {
    // Aggiungo se non esiste
    return baseUrl + `&start=${start}`;
  }
}

export default parseResponse;
