import React from "react"
import Layout from "../components/layout"

const SearchPage = ({ location }) => {
  const queryParam = location.search ? location.search.split("=")[1] : ""
  const query = decodeURIComponent(queryParam) // Decode the query parameter

  return (
    <Layout>
      <div>
        <h1>Risultati della ricerca</h1>
        {query ? <p>Query: {query}</p> : <p>No search query provided.</p>}
        {/* Qui puoi aggiungere la logica per mostrare i risultati della ricerca */}
      </div>
    </Layout>
  )
}

export default SearchPage
