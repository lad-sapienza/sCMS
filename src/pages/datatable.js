import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import DataTable from "react-data-table-component"
import { Container } from "react-bootstrap"

const MappaPage2 = () => {
  // Client-side Runtime Data Fetching
  // Stato per memorizzare i dati ottenuti dall'API
  // in dati viene salvato il risultato di impostaDati
  const [dati, impostaDati] = useState([])
  // Stato per gestire lo stato di caricamento
  const [caricamento, impostaCaricamento] = useState(true)
  // Stato per gestire lo stato di errore
  const [errore, impostaErrore] = useState(null)

  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    const ottieniDati = async () => {
      try {
        // Imposta lo stato di caricamento a true durante il recupero dei dati
        impostaCaricamento(true)
        // Ottieni i dati dall'API
        const risposta = await fetch(
          `https://inrome.sns.it/db/${process.env.GATSBY_DIRECTUS_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_TOKEN}`, // Aggiungi il token all'header
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

    // Chiama la funzione ottieniDati quando il componente viene montato
    ottieniDati()
  }, []) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di caricamento ed errore
  if (caricamento) {
    return <div>Caricamento...</div>
  }

  if (errore) {
    return <div>Errore: {errore.message}</div>
  }

  const colonne = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Titolo",
      selector: "title",
      sortable: true,
    },
    {
      name: "Riassunto",
      selector: "summary",
      sortable: true,
    },
  ]

  // Renderizza il componente con i dati ottenuti
  return (
    <Layout>
      <Container>
        <div>
          <h1>Dati dall'API organizzate in datatable:</h1>
          <DataTable columns={colonne} data={dati} pagination />
        </div>
      </Container>
    </Layout>
  )
}

export default MappaPage2
