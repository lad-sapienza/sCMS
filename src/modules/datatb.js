import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { Container } from "react-bootstrap"
import styled from "styled-components"
import getData from "../services/getData"

const DataTb = props => {
  const [csvData, setCsvData] = useState()
  const [dati, impostaDati] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errore, impostaErrore] = useState(false)
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

  console.log("path2csv:", props.path2csv)
  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    setIsLoading(true)

    if (props.path2csv) {
      getData(props.path2csv, null, "csv2json")
        .then(csvData => {
          setCsvData(csvData)
          setIsLoading(false)
        })
        .catch(err => {
          console.log()
          impostaErrore({
            message: "Error getting remote data from static file",
            stack: err,
          })
          setIsLoading(false)
        })
    } else {
      // Define Drectus endpoint anche check all dependencies
      let endPoint
      if (props.dEndPoint) {
        endPoint = props.dEndPoint
      } else if (process.env.GATSBY_DIRECTUS_ENDPOINT && props.dTable) {
        endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${props.dTable}`
      } else {
        impostaErrore({
          message:
            "Cannont calculate Directus enpoint. Please provide a full endpoint as a MyMap attribute or provide dTable attribute and set GATSBY_DIRECTUS_ENDPOINT environmental variable",
        })
        setIsLoading(false)
        return
      }
      if (props.dFilter) {
        endPoint += `?${props.dFilter}`
      }
      // Define Directus token
      const token = props.dToken
        ? props.dToken
        : process.env.GATSBY_DIRECTUS_TOKEN
      if (!token) {
        impostaErrore({
          mesage:
            "Cannot calculate Directus token. Please provide it as an attribute of the MyMap component or define it as the environmnetal variable GATSBY_DIRECTUS_TOKEN",
        })
        setIsLoading(false)
        return
      }
      getData(endPoint, token, "json")
        .then(risultato => {
          impostaDati(risultato.data || [])
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          impostaErrore({ message: "Error getting remote data", stack: err })
        })
    }
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  console.log(csvData)
  console.log(dati)
  // Determine which data to use based on the existence of props.path2csv
  // const dataToUse = props.path2csv ? csvData : dati

  const filteredData = dati.filter(item =>
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

  if (errore) {
    return <div>Errore: {errore.message}</div>
  }

  // Renderizza il componente con i dati ottenuti
  return (
    <Container>
      <Table>
        <input
          type="text"
          className="form-control mb-5"
          value={searchText}
          placeholder="Search..."
          onChange={handleSearch}
        />
        <DataTable columns={props.dColumns} data={filteredData} pagination />
      </Table>
    </Container>
  )
}

//style
const Table = styled.div`
  a,
  a:visited {
    color: #000000;
    text-decoration: none;
  }

  a:hover {
    color: red;
    text-decoration: none;
  }
`
export default DataTb
