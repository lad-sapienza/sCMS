import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { Container } from "react-bootstrap"
import styled from "styled-components"

const DataTb = props => {
  const [dati, impostaDati] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errore, impostaErrore] = useState(null)
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
    const ottieniDati = async () => {
      if (!debounceTimer) {
        try {
          // Esegui la ricerca solo quando il timer di debounce è scaduto
          // Imposta lo stato di caricamento a true durante il recupero dei dati
          setIsLoading(true)
          // Ottieni i dati dall'API
          const risposta = await fetch(`${props.dEndPoint}`, {
            headers: {
              Authorization: `Bearer ${props.dToken}`, // Aggiungi il token all'header
            },
          })
          // Parsa la risposta JSON
          const risultato = await risposta.json()
          // Aggiorna lo stato con i dati ottenuti
          impostaDati(risultato.data || [])
        } catch (errore) {
          // Se si verifica un errore, aggiorna lo stato di errore
          impostaErrore(errore)
        } finally {
          // Imposta lo stato di caricamento a false quando il recupero è completato
          setIsLoading(false)
        }
      }
    }
    // Chiama la funzione ottieniDati quando il componente viene montato e inserisci il valore iniziale della pagina
    ottieniDati(1)
  }, [props, errore, searchText]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

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
