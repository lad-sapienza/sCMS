import directusSourceProptypes from "./directusSourceProptypes"

const formatUrl = ({ endPoint, table, id, queryString, token }) => {
  
  let ret = {
    sourceUrl: "",
    options: {},
  }

  if (!endPoint && !process.env.GATSBY_DIRECTUS_ENDPOINT) {
    throw new Error(
      "Either `endPoint` or env variable `GATSBY_DIRECTUS_ENDPOINT` are needed to work with Directus",
    )
  }

  if (!table) {
    throw new Error(
      "Parameter `directus.table` is required to work with Directus",
    )
  }

  ret.sourceUrl = endPoint ? endPoint : process.env.GATSBY_DIRECTUS_ENDPOINT

  ret.sourceUrl += `${ret.sourceUrl.endsWith("/") ? "" : "/"}items/${table}`

  if (id) {
    ret.sourceUrl += `/${id}`
  }

  ret.sourceUrl += `?${queryString ? queryString : ""}`

  const authToken = token ? token : process.env.GATSBY_DIRECTUS_TOKEN

  if (authToken) {
    ret.options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  }

  return ret;
}


formatUrl.propTypes = directusSourceProptypes


export default formatUrl
