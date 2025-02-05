/**
 * parseResponse - Scarica tutti i risultati EDR con paginazione `&start=...`.
 * Gestisce più chiamate se l'API EDR limita i risultati a blocchi di 100.
 *
 * @param {Response} response - Prima risposta già fetchata da getDataFromSource
 * @returns {Array} - Un array con tutti i risultati concatenati.
 */
const parseResponse = async (response) => {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Leggi l'URL effettivo chiamato (include ?start=0 ...?)
    const baseUrl = response.url;
    console.log("[parseResponse] baseUrl:", baseUrl);

    // Decodifica la prima risposta
    let data = await response.json();
    console.log("[parseResponse] first data:", data);

    // Unisci i risultati in un array
    let allResults = data?.results || [];

    // Se non ci sono risultati, errore -> "No results"
    if (allResults.length === 0) {
      throw new Error("La risposta dell'API EDR non contiene risultati.");
    }

    // Esempio di soglia: se EDR restituisce esattamente 100 in data.results, potremmo averne altri
    // Decodifica param "start" dall'URL
    let start = getStartParam(baseUrl) || 0;

    // Finché ottengo blocchi di 100, continuo a fare fetch
    while (allResults.length % 100 === 0) {
      start += 100; // Incremento
      const nextUrl = setStartParam(baseUrl, start);
      console.log("[parseResponse] nextUrl:", nextUrl);

      // Eseguo una nuova fetch
      const nextResp = await fetch(nextUrl);
      if (!nextResp.ok) {
        // Fine, se la fetch non va a buon fine o l'API non supporta offset
        console.warn(`[parseResponse] HTTP Error fetching ${nextUrl}`);
        break;
      }
      const nextData = await nextResp.json();

      if (!nextData.results || nextData.results.length === 0) {
        console.log("[parseResponse] no more results in next page");
        break;
      }

      console.log(`[parseResponse] page start=${start}, results:`, nextData.results.length);

      // Concatena i nuovi record
      allResults = allResults.concat(nextData.results);

      // Se la nuova pagina non è 100 record, fine
      if (nextData.results.length < 100) {
        break;
      }
    }

    // Ritorno l'array unito
    return allResults;
  } catch (error) {
    console.error("Errore durante l'elaborazione della risposta EDR:", error);
    throw new Error("Errore nel parsing della risposta EDR.");
  }
};

/**
 * getStartParam - estrae il parametro &start=N da una URL
 */
function getStartParam(url) {
  const match = url.match(/[?&]start=(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

/**
 * setStartParam - sostituisce o aggiunge &start=N in baseUrl
 */
function setStartParam(baseUrl, start) {
  if (baseUrl.includes("start=")) {
    // sostituisco
    return baseUrl.replace(/start=\d+/, `start=${start}`);
  } else {
    // aggiungo
    return baseUrl + `&start=${start}`;
  }
}

export default parseResponse;
