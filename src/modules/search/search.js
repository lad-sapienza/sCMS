import React, { Fragment, useState } from "react"
import PropTypes from "prop-types"

import SearchUI from "./searchUI"

import plain2directus from "../../services/transformers/plain2directus"
import getDataFromSource from "../../services/getDataFromSource"
import sourcePropTypes from "../../services/sourcePropTypes"

const Search = ({
  source,
  resultItemTemplate,
  fieldList,
  operators,
  connector,
}) => {
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState(null)
  
  if (!fieldList) {
    setError("fieldList parameter is mising")
  }
  
  const processData = (conn, inputs) => {
    const filter = JSON.stringify(plain2directus(conn, inputs))

    source.transType = "json";
    source.dQueryString = `${source.dQueryString ? `${source.dQueryString}&` : ""}filter=${filter}`
    
    getDataFromSource(source)
      .then(data => {
        if (data.errors) {
          setError("Error in querying getting remote data 1")
        } else {
          setError(null)
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
      <SearchUI
        fieldList={fieldList}
        operators={operators}
        connector={connector}
        processData={processData}
      />

      {error && <div className="text-danger">{error}</div>}

      {searchResults?.length === 0 && (
        <div className="text-warning">No results found</div>
      )}

      {searchResults?.length > 0 && !error && (
        <Fragment>
          <h1 className="mt-5">Results</h1>
          <div className="resultsContainer">
            {searchResults.map(item => resultItemTemplate(item))}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Search.propTypes = {
  source: sourcePropTypes.isRequired,
  /**
   * Template to use for results
   */
  resultItemTemplate: PropTypes.func,
  /**
   * List of fields
   */
  fieldList: PropTypes.object.isRequired,
  /**
   * List of operators
   */
  operators: PropTypes.object,
  /**
   * List of connectors
   */
  connector: PropTypes.object,
}

export { Search }
