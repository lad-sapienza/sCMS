import form2querystring from "./form2querystring";

const formatUrl = (uiFilter) => {
  const { conn, inputs } = uiFilter;

  let ret = {
    sourceUrl:
      "http://www.edr-edr.it/edr_programmi/edr_api.php?ancient_city=roma",
    options: {},
  };

  // 🔹 Se la ricerca è semplice (SOLO per "text"), usa solo quel campo
  if (
    inputs.length === 1 &&
    inputs[0].field === "text" &&
    inputs[0].value
  ) {
    ret.sourceUrl += `&text=${encodeURIComponent(inputs[0].value)}`;
    return ret; // 🔹 Restituisce subito l'URL senza altri filtri
  }

  // 🔹 Se la ricerca è avanzata (AND/OR), processa tutti i filtri
  const filters = inputs.map(input => form2querystring(conn, [input]));

  // 🔹 Rimuove eventuali filtri vuoti
  const validFilters = filters.filter(filter => Object.keys(filter).length > 0);

  if (validFilters.length > 0) {
    const serializedQuery = validFilters
      .map(filter => Object.entries(filter)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")
      )
      .join(conn === "_or" ? "&or=" : "&");

    ret.sourceUrl += `&${serializedQuery}`;
  }

  return ret;
};

export default formatUrl;
