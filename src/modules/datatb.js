import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import getDataFromSource from "../services/getDataFromSource"
import PropTypes from "prop-types"
import sourcePropTypes from "../services/sourcePropTypes"

const DataTb = ({ source, columns, ...props }) => {
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

    getDataFromSource(source)
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
  }, [source]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

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

  return (
    <>
      <input
        type="text"
        className="form-control mb-5"
        value={searchText}
        placeholder="Search..."
        onChange={handleSearch}
      />
      <DataTable data={filteredData} pagination columns={columns} {...props} />
    </>
  )
}

DataTb.propTypes = {
  source: sourcePropTypes.isRequired,
  /**
   * Array describing colums: https://react-data-table-component.netlify.app/?path=/docs/api-columns--docs
   */
  columns: PropTypes.array.isRequired,
}

export { DataTb }
