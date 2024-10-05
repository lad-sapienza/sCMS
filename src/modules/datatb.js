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

    if (props.path2data) {
      getData(props.path2data, null, "csv2json")
        .then(jsonData => {
          setData(jsonData)
          setIsLoading(false)
        })
        .catch(err => {
          setError({
            message: "Error getting remote data from static file",
            stack: err,
          })
          setIsLoading(false)
          return
        })
    } else {
      // Define Drectus endpoint anche check all dependencies
      let endPoint
      if (props.dEndPoint) {
        endPoint = props.dEndPoint
      } else if (process.env.GATSBY_DIRECTUS_ENDPOINT && props.dTable) {
        endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${props.dTable}`
      } else {
        setError({
          message:
            "Cannont calculate Directus enpoint. Please provide a full endpoint as an attribute or provide dTable attribute and set GATSBY_DIRECTUS_ENDPOINT environmental variable",
        })
        setIsLoading(false)
        return
      }
      if (props.dQueryString) {
        endPoint += `?${props.dQueryString}`
      }
      // Define Directus token
      const token = props.dToken
        ? props.dToken
        : process.env.GATSBY_DIRECTUS_TOKEN
      if (!token) {
        setError({
          mesage:
            "Cannot calculate Directus token. Please provide it as an attribute of the component or define it as the environmnetal variable GATSBY_DIRECTUS_TOKEN",
        })
        setIsLoading(false)
        return
      }
      getData(endPoint, token, "json")
        .then(risultato => {
          setData(risultato.data || [])
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          setError({ message: "Error getting remote data", stack: err })
        })
    }
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  const filteredData = data.filter(item =>
    Object.values(item).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  // Renderizza il componente in base agli stati di caricamento ed errore
  if (isLoading) {
    return <div>Caricamento...</div>
  }

  if (error) {
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
  path2data: PropTypes.string,
  dEndPoint: PropTypes.string,
  dToken: PropTypes.string,
  dTable: PropTypes.string,
  dQueryString: PropTypes.string
}

export { DataTb }
