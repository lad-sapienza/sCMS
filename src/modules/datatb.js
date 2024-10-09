import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import DataTable from "react-data-table-component"
import getData from "../services/getData"

const DataTb = props => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [debounceTimer, setDebounceTimer] = useState(null)

  // SEARCH BOX
  const handleSearch = e => {
    const searchTerm = e.target.value
    setSearchText(searchTerm)

    // Cancella il timer precedente
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Imposta un nuovo timer per eseguire la ricerca dopo 300 millisecondi
    const newDebounceTimer = setTimeout(() => {
      setDebounceTimer(null)
      handleDebouncedSearch(searchTerm)
    }, 300)

    setDebounceTimer(newDebounceTimer)
  }

  const handleDebouncedSearch = searchTerm => {
    setSearchText(searchTerm)
  }

  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    setIsLoading(true)

    getData({
      path2data: props.path2data,
      dEndPoint: props.dEndPoint,
      dToken: props.dToken,
      dTable: props.dTable,
      dQueryString: props.dQueryString,
    })
      .then(jsonData => {
        setIsLoading(false)
        setData(jsonData || [])
      })
      .catch(err => {
        setError({
          message: "Error getting data",
          stack: err,
        })
        setIsLoading(false)
        return
      })
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  const filteredData = data.filter(item =>
    Object.values(item).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase()),
    ),
  )

  // Renderizza il componente in base agli stati di caricamento ed errore
  if (isLoading) {
    return <div>Caricamento...</div>
  }

  if (error) {
    console.log(error)
    return <div className="text-error">Error: {error.message}</div>
  }

  // Renderizza il componente con i dati ottenuti
  return (
    <>
      <input
        type="text"
        className="form-control mb-5"
        value={searchText}
        placeholder="Search..."
        onChange={handleSearch}
      />
      <DataTable data={filteredData} pagination {...props} />
    </>
  )
}

DataTb.propTypes = {
  /**
   * Local or remote link to data (CSV, JSON, GeoJSON, ecc)
   * Required if dEndPoint or dTable are not set
   */
  path2data: PropTypes.string,
  /**
   * Directus endpoint.
   * Required if either dTable (and env GATSBY_DIRECTUS_ENDPOINT) or path2data are not set
   */
  dEndPoint: PropTypes.string,
  /**
   * Directus table name, to be used if env variable GATSBY_DIRECTUS_ENDPOINT is set.
   * Required if neither path2data or dEndPoit are set
   */
  dTable: PropTypes.string,
  /**
   * Directus optional filters and other, provided as querystring compatible to Directus API
   */
  dQueryString: PropTypes.string,
  /**
   * Directus access token.
   * Required if env variable GATSBY_DIRECTUS_TOKEN is not set
   */
  dToken: PropTypes.string,
  
}

export { DataTb }
