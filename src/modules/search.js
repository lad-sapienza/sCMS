import React, { Fragment, useState } from "react"

import SearchUI from "./search/searchUI"

import { plain2directus } from "./search/transformers"

import getData from "../services/getData"

const Search = ({
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  resultItemTemplate,
  fieldList,
  operators,
  connector
}) => {
  const [searchResults, setSearchResults] = useState(null)
  // Stato per gestire lo stato di errore
  const [error, setError] = useState(null)

  const processData = (conn, inputs) => {
    
    let endPoint

    if (dEndPoint) {
      endPoint = dEndPoint
    } else if (dTable) {
      if (!process.env.GATSBY_DIRECTUS_ENDPOINT) {
        setError(
          "Cannot calculate API end-point. Parameter dTable requires the enc variable GATSBY_DIRECTUS_ENDPOINT to  be set"
        )
      }
      endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${dTable}`
    } else {
      setError(
        "Cannot calculate API end-point. dEndpoint or dTable parameter is missing"
      )
    }

    const token = dToken
        ? dToken
        : process.env.GATSBY_DIRECTUS_TOKEN;
    

    if (!token) {
      setError(
        "Directus token is missing. It should be provided as dToken parameter or as a GATSBY_DIRECTUS_TOKEN env variable"
      )
    }
    if (!fieldList) {
      setError("fieldList parameter is mising")
    }
    const filter = JSON.stringify(plain2directus(conn, inputs));

    getData(`${endPoint}?filter=${filter}`, token, "json")
      .then(data => {
        if (data.errors) {
          console.log(data.errors)
          setError("Error in querying getting remote data 1")
        } else {
          setError(null);
          setSearchResults(data)
        }
      })
      .catch(err => {
        console.log(err)
        setError("Error in querying getting remote data 2")
      })
  }

  return (
    <Fragment>
      <SearchUI fieldList={fieldList} operators={operators} connector={connector} processData={processData} />
      

      {error && <div className="text-danger">{error}</div>}
      
      {searchResults.data.length ===0  && <div className="text-warning">No results found</div>}

      {searchResults && searchResults.data.length > 0  && !error && (
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
