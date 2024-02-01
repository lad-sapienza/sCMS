import React, { useState } from "react"
import Seo from "../components/seo"
import { Container } from "react-bootstrap"

const SearchPage = props => {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  // Stato per gestire lo stato di errore
  const [impostaErrore] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()

    // Dependency check
    if (!props.dTable) {
      impostaErrore({
        message:
          "Error in building map. No source found for the data: either dTable or path2geojson parameters are required",
      })
    }

    if (props.dTable && !props.dToken) {
      impostaErrore({ message: "Directus token is missing" })
    }

    try {
      const res = await fetch(
        `${props.dTable}?filter[${props.Filter}][${props.FilterType}]=${query}`,
        {
          headers: {
            Authorization: `Bearer ${props.dToken}`, // Aggiungi il token all'header
          },
        }
      )
      const data = await res.json()
      setSearchResults(data)
    } catch (errore) {
      console.error("Errore nella ricerca:", errore)
    }
  }
  return (
    <Container>
      <Seo title="Ricerca" />
      <form onSubmit={handleSubmit} className="mt-5">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter your search query"
        />
        <button type="submit">Search</button>
      </form>
      
      {searchResults && (
        <>
        <h1>Risultati</h1>
        <ul>
          {searchResults.data.map((result, index) => (
            <li key={index}>
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
            </li>
          ))}
        </ul>
        </>
      )}
      <br />
      <br />
      <br />
      <br />
    </Container>
  )
}

export default SearchPage
