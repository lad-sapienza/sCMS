import React, { useState } from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const SearchPage = () => {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const res = await fetch(`/api/search?query=${query}`)
      const data = await res.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Errore nella ricerca:", error)
    }
  }

  return (
    <Layout>
      <Seo title="Ricerca" />
      <h1>Ricerca</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Inserisci la query di ricerca"
        />
        <button type="submit">Cerca</button>
      </form>

      {searchResults && (
        <ul>
          {searchResults.data.map((result, index) => (
            <li key={index}>
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
            </li>
          ))}
        </ul>
      )}

      <Link to="/">Torna alla homepage</Link>
    </Layout>
  )
}

export default SearchPage
