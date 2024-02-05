import React, { Fragment, useState } from "react"

import getData from "../services/getData"

const Search = ({
  dEndPoint,
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
    event.preventDefault();

    let endPoint;

    if (dEndPoint) {
      endPoint = dEndPoint;
    } else if (dTable) {
      if (!process.env.GATSBY_DIRECTUS_ENDPOINT){
        setError("Cannot calculate API end-point. Parameter dTable requires the enc variable GATSBY_DIRECTUS_ENDPOINT to  be set");
      }
      endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${dTable}`
    } else {
      setError("Cannot calculate API end-point. dEndpoint or dTable parameter is missing" );
    }

    const token = dToken ? dToken : process.env.GATSBY_DIRECTUS_TOKEN
    if (!token) {
      setError( "Directus token is missing. It should be provided as dToken parameter or as a GATSBY_DIRECTUS_TOKEN env variable")
    }
    if (!searchFields) {
      setError( "searchFields parameter is mising" )
    }
    const query_parts = searchFields.split(",").map((fld, index) => {
      return `[${index}][${fld.trim()}][_icontains]=${query}`
    })

    const final_query = `filter[_or]${query_parts.join(`&filter[_or]`)}`

    getData(`${endPoint}?${final_query}`, dToken, 'json')
      .then(data => {
        if (data.errors) {
          console.log(data.errors)
          setError( "Error in querying getting remote data")
        } else {
          setSearchResults(data)
        }
      })
      .catch(err => {
        console.log(err)
        setError( "Error in querying getting remote data" )
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

      {error && <div className="text-danger">{ error }</div>}

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
