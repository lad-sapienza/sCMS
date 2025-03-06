/**
 * Search Component
 *
 * A React component that provides a search interface for querying data from a specified source.
 * It allows users to input search criteria and displays the results based on the provided template.
 *
 */

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

import SearchUI from "./searchUI"
import getDataFromSource from "../../services/getDataFromSource"
import sourcePropTypes from "../../services/sourcePropTypes"
import { defaultOperatorsProptypes } from "./defaultOperators"
import fieldsPropTypes from "../../services/fieldsPropTypes"

const Search = ({
  source,
  resultItemTemplate,
  resultsHeaderTemplate = tot => (
    <>
      <h1 className="mt-5">Results</h1>
      <p className="text-secondary">— {tot} records found</p>
    </>
  ),
  fieldList,
  operators,
  connector,
  limitTo,
  onSearchRun,
}) => {
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [queryRun, setQueryRun] = useState(false)

  useEffect(() => {
    if (!fieldList) {
      setError("fieldList parameter is missing")
    }
  }, [fieldList])

  const processData = async (conn, inputs) => {
    try {
      setIsLoading(true)
      const filter = {
        conn: conn,
        inputs: inputs,
      }
      const data = await getDataFromSource(source, filter)
      setQueryRun(true)

      if (!data || data.errors) {
        throw new Error("Error in querying remote data")
      }
      setSearchResults(data)
      if (typeof onSearchRun === "function") {
        onSearchRun(filter)
      }
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Error in querying remote data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SearchUI
        fieldList={fieldList}
        operators={operators}
        connector={connector}
        processData={processData}
        limitTo={limitTo}
      />

      {error && <div className="text-danger">{error}</div>}
      {isLoading && <div className="text-info">Loading...</div>}
      {queryRun && searchResults.length === 0 && !error && !isLoading && (
        <div className="text-warning">No results found</div>
      )}
      {searchResults.length > 0 && !error && (
        <>
          {resultsHeaderTemplate(searchResults.length)}
          <div className="resultsContainer">
            {searchResults.map(item => resultItemTemplate(item))}
          </div>
        </>
      )}
    </>
  )
}

Search.propTypes = {
  /**
   * Object with information to source data.
   * This should include the necessary properties for querying the data source.
   */
  source: sourcePropTypes.isRequired,

  /**
   * Template function to render each result item.
   * This function receives an item from the search results and should return a React element.
   */
  resultItemTemplate: PropTypes.func.isRequired,
  /**
   * Template function to render the header of the results.
   * Default is a simple header in English with the number of results.
   */
  resultsHeaderTemplate: PropTypes.func,
  /**
   * List of fields to be used in the search.
   * This should be an object defining the fields available for querying.
   */
  fieldList: fieldsPropTypes,

  /**
   * Object containing the identifiers of the operators (keys) and the labels to use for the UI.
   * This can be used to overwrite default options, for example, to have the UI translated in a language different from English.
   * Its presence does not impact functionality.
   */
  operators: defaultOperatorsProptypes,

  /**
   * Object containing the logical connectors (keys) and the labels to use for the UI.
   * This can be used to overwrite the default value, for example, to have the UI translated in a language different from English.
   * Its presence does not impact functionality.
   */
  connector: PropTypes.shape({
    _and: PropTypes.string,
    _or: PropTypes.string,
  }),
  /**
   * Limit the search UI to a simple or advanced version.
   * Default is "simple".
   */
  limitTo: PropTypes.oneOf(["simple", "advanced"]),
  /**
   * Callback function to run when the search is executed.
   * This function receives the filter object used in the query.
   */
  onSearchRun: PropTypes.func,
}

export { Search }
