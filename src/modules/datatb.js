import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { Container } from "react-bootstrap"
import styled from "styled-components"

const DataTb = props => {
  // Client-side Runtime Data Fetching
  // Stato per memorizzare i dati ottenuti dall'API
  // in dati viene salvato il risultato di impostaDati
  const [dati, impostaDati] = useState([])
  // Stato per gestire lo stato di caricamento
  const [caricamento, impostaCaricamento] = useState(true)
  // Stato per gestire lo stato di errore
  const [errore, impostaErrore] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [dataLimit] = useState(props.dLimit || 100)

  // Dependency check
  if (!props.dTable) {
    impostaErrore({
      message:
        "Error in building data table. No source found for the data: dTable parameter is required",
    })
  }

  if (props.dTable && !props.dToken) {
    impostaErrore({ message: "Directus token is missing" })
  }
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
    const ottieniDati = async page => {
      if (!debounceTimer) {
        const offset = (page - 1) * dataLimit
        try {
          // Esegui la ricerca solo quando il timer di debounce è scaduto
          // Imposta lo stato di caricamento a true durante il recupero dei dati
          impostaCaricamento(true)
          // Ottieni i dati dall'API
          const risposta = await fetch(
            `${props.dTable}?limit=${dataLimit}&offset=${offset}`,
            {
              headers: {
                Authorization: `Bearer ${props.dToken}`, // Aggiungi il token all'header
              },
            }
          )
          // Parsa la risposta JSON
          const risultato = await risposta.json()
          // Aggiorna lo stato con i dati ottenuti
          impostaDati(risultato.data || [])
        } catch (errore) {
          // Se si verifica un errore, aggiorna lo stato di errore
          impostaErrore(errore)
        } finally {
          // Imposta lo stato di caricamento a false quando il recupero è completato
          impostaCaricamento(false)
        }
      }
    }
    // Chiama la funzione ottieniDati quando il componente viene montato e inserisci il valore iniziale della pagina
    ottieniDati(1)
  }, [props, dataLimit, errore, searchText]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  const filteredData = dati.filter(item =>
    Object.values(item).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  // Renderizza il componente in base agli stati di caricamento ed errore
  if (caricamento) {
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
