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
import plain2directus from "../../services/transformers/plain2directus"
import getDataFromSource from "../../services/getDataFromSource"
import sourcePropTypes from "../../services/sourcePropTypes"
import { defaultOperatorsProptypes } from "./defaultOperators"
import fieldsPropTypes from "../../services/fieldsPropTypes"
import queryString from "query-string"

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
}) => {
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)
  const [queryRun, setQueryRun] = useState(false)

  useEffect(() => {
    if (!fieldList) {
      setError("fieldList parameter is missing")
    }
  }, [fieldList])

  const processData = async (conn, inputs) => {
    try {
      const filter = plain2directus(conn, inputs)

      const newSource = createNewSource(source, filter)

      const data = await getDataFromSource(newSource)
      setQueryRun(true)

      if (data.errors) {
        throw new Error("Error in querying remote data")
      }

      setSearchResults(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Error in querying remote data")
    }
  }
  
  /** 
   * Creates a new source object with an updated filter in the query string.
   *
   * @param {Object} source - The original source object.
   * @param {Object} filter - The filter object to be added to the query string.
   * @returns {Object} - The new source object with the updated filter.
   */
  const createNewSource = (source, filter) => {
    const newSource = structuredClone(source)
    newSource.transType = "json"

    // Source already has a dQueryString
    if (typeof newSource.dQueryString !== "undefined") {
      const queryObj = queryString.parse(newSource.dQueryString)
      // Check if filter is available in the query
      if (queryObj.filter) {
        // dQueryString has a filter: parse it and add the new filter to the existing one
        const mainFilterObj = JSON.parse(queryObj.filter)
        queryObj.filter = JSON.stringify({
          "_and": [mainFilterObj, filter]
        });
        newSource.dQueryString = queryString.stringify(queryObj)

      } else {
        // Source has a dQueryString but no filter: add filter to query object
        queryObj.filter = JSON.stringify(filter);
        newSource.dQueryString = queryString.stringify(queryObj)
      }
    } else {
      // Source does not have a dQueryString: provide filter, as is
      newSource.dQueryString = queryString.stringify({filter: filter})
    }

    return newSource
  }

  return (
    <>
      <SearchUI
        fieldList={fieldList}
        operators={operators}
        connector={connector}
        processData={processData}
      />

      {error && <div className="text-danger">{error}</div>}

      {queryRun && searchResults.length === 0 && !error && (
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
}

export { Search }
