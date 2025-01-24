const FormatUrl = directusSource => {
  const { endPoint, table, id, queryString, token } = directusSource

  let sourceUrl
  let options = {}

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

  sourceUrl = endPoint ? endPoint : process.env.GATSBY_DIRECTUS_ENDPOINT

  sourceUrl += `${sourceUrl.endsWith("/") ? "" : "/"}items/${table}`

  if (id) {
    sourceUrl += `/${id}`
  }

  sourceUrl += `?${queryString ? queryString : ""}`

  const authToken = token ? token : process.env.GATSBY_DIRECTUS_TOKEN

  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  return {
    sourceUrl,
    options,
  }
}

directusSource.propTypes = {
  endPoint: PropTypes.string,
  table: PropTypes.string,
  queryString: PropTypes.string,
  token: PropTypes.string,
  id: PropTypes.number,
}

export { FormatUrl }
