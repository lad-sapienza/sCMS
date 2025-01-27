import form2querystring from "./form2querystring";

const formatUrl = (uiFilter) => {
  const { conn, inputs } = uiFilter;

  let ret = {
    sourceUrl:
      "http://www.edr-edr.it/edr_programmi/edr_api.php?ancient_city=roma",
    options: {},
  };

  console.log("Inputs received in formatUrl:", inputs);

  // Itera sui filtri e si ferma al primo filtro valido
  for (let input of inputs) {
    // Adatta il filtro per l'API EDR 
    const adjustedInput = {
      ...input,
      operator: "", // vuoto non necessario
    };

    console.log("Adjusted Input:", adjustedInput);

    // Genera il filtro con `form2querystring`
    const filter = form2querystring("_and", [adjustedInput]); // Usa il filtro corrente
    console.log("Filter generated for current input:", filter);

    // Verifica che il filtro sia valido
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      const serializedQuery = Object.entries(filter)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      // Costruisce l'URL con il primo filtro valido e si interrompe
      ret.sourceUrl += `&${serializedQuery}`;
      console.log("Valid filter found. URL:", ret.sourceUrl);
      break; // Interrompe il ciclo dopo il primo filtro valido
    }
  }

  console.log("Final URL generated to pass to getDataFromSource:", ret.sourceUrl);

  return ret;
};

export default formatUrl;
