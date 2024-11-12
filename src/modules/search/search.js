import React, { Fragment, useState } from "react"
import PropTypes from "prop-types"

import SearchUI from "./searchUI"

import plain2directus from "../../services/transformers/plain2directus"
import getDataFromSource from "../../services/getDataFromSource"
import sourcePropTypes from "../../services/sourcePropTypes"
import { defaultOperatorsProptypes } from "./defaultOperators"

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

    source.transType = "json"
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
  /**
   * Object with information to source data
   */
  source: sourcePropTypes.isRequired,
  /**
   * Template function to use to show the results
   */
  resultItemTemplate: PropTypes.func.isRequired,
  /**
   * List of fields
   */
  fieldList: PropTypes.object.isRequired,
  /**
   * Literal object containing the idetifiers of the operators (keys) and the labels to use for the UI. It can be used to overwrite default options, for example to have the UI translated in a language different from English. Its presence does not impact functionality.
   */
  operators: defaultOperatorsProptypes,
  /**
   * Literal object containing the logical connectors (keys) and the labels to use for the UI. It can be used to overwrite the default value, for example to have the UI translated in a language different from English. Its presence does not impact functionality.
   */
  connector: PropTypes.shape({
    _and: PropTypes.string,
    _or: PropTypes.string,
  }),
}

export { Search }
