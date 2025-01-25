import form2querystring from "./form2querystring"

const formatUrl = uiFilter => {

  const {conn, inputs} = uiFilter

  let ret = {
    sourceUrl:
      "http://www.edr-edr.it/edr_programmi/edr_api.php?ancient_city=roma",
    options: {},
  }

  const filter = form2querystring(conn, inputs)

  if (filter && typeof filter === "object") {
    const serializedQuery = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")
    ret.sourceUrl += `&${serializedQuery}`
  }

  return ret
}

export default formatUrl
