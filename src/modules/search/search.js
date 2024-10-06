import React, { Fragment, useState } from "react"
import PropTypes from "prop-types"

import SearchUI from "./searchUI"

import { plain2directus } from "../transformers/index"
import getData from "../../services/getData"

const Search = ({
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
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

    getData({
      dEndPoint: dEndPoint,
      dTable: dTable,
      dToken: dToken,
      dQueryString: `${dQueryString ? `${dQueryString}&` : ""}filter=${filter}`,
      transType: "json",
    })
      .then(data => {
        if (data.errors) {
          console.log(data.errors)
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

SearchUI.propTypes = {
  /**
   * Full URL of Directus endpoint
   */
  dEndPoint: PropTypes.string,
  /**
   * Directus table
   */
  dTable: PropTypes.string,
  /**
   * Directus access token
   */
  dToken: PropTypes.string,
  /**
   * Directus query string
   */
  dQueryString: PropTypes.string,
  /**
   * Template to use for results
   */
  resultItemTemplate: PropTypes.func,
  /**
   * List of fields
   */
  fieldList: PropTypes.object,
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
