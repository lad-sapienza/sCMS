import React, { Fragment, useState } from "react"

import getData from "../services/getData"

const Search = ({
  dTable,
  dToken,
  dFilter,
  resultItemTemplate,
  searchFields,
}) => {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  // Stato per gestire lo stato di errore
  const [error, setError] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()

    // Dependency check
    if (!dTable) {
      setError({
        message:
          "Error in building map. No source found for the data: either dTable or path2geojson parameters are required",
      })
    }

    if (!dToken) {
      setError({ message: "Directus token is missing" })
    }
    if (!searchFields) {
      setError({ message: "searchFields parameter is mising" })
    }
    const query_parts = searchFields.split(",").map((fld, index) => {
      // DA FINIRE
      return `[${index}][${fld.trim()}][icontains]=${query}`
    })

    const final_query = `filter[_or]${query_parts.join(`&filter[_or]`)}`

    getData(`${dTable}?${final_query}`, dToken, 'json')
      .then(data => {
        if (data.errors) {
          setError({
            message: "Error in querying getting remote data",
            stack: data.errors,
          })
        } else {
          setSearchResults(data)
        }
      })
      .catch(err => {
        setError({
          message: "Error in querying getting remote data",
          stack: err,
        })
      })
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="mt-5 row searchForm">
        <div className="col-auto labelContainer">
          <label htmlFor="search_input" className="visually-hidden label">
            Search
          </label>
          <input
            id="search_input"
            type="text"
            className="form-control searchInput"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {error && <div className="text-danger">{error.message}</div>}

      {searchResults && !error && (
        <Fragment>
          <h1 className="mt-5">Results</h1>
          <div className="resultsContainer">
            {searchResults.data.map(item => resultItemTemplate(item))}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Search
