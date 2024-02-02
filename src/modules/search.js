import React, { Fragment, useState } from "react"
import Seo from "../components/seo"

const Search = props => {
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
    <Fragment>
      <Seo title="Ricerca" />
      <form onSubmit={handleSubmit} className="mt-5 row">
        <div class="col-auto">
          <label htmlFor="search_input" class="visually-hidden">Search</label>
          <input
            id="search_input"
            type="text"
            className="form-control"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search the database for something"
          />
        </div>

        <div class="col-auto">
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
        
      </form>
      
      {searchResults && (
        <Fragment>
        <h1 className="mt-5">Risultati</h1>
        <ul>
          {searchResults.data.map((result, index) => (
            <li key={index}>
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
            </li>
          ))}
        </ul>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Search
