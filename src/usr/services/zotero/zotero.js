import formatUrl from "./formatUrl"
import form2querystring from "./form2querystring"
import parseResponse from "./parseResponse" // la versione base
import parseResponseOnto from "./parseResposeOnto" // la versione con ontologia

// 1) Servizio base (solo ricerca testuale)
export const ZoteroService = {
  formatUrl,
  parseResponse,
  form2querystring,
}

// 2) Servizio “geo” (fusione con ontologia)
export const ZoteroGeoService = {
  formatUrl,
  parseResponse: parseResponseOnto,
  form2querystring,
}
