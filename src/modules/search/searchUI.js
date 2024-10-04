import React, { useState } from "react"
import PropTypes from "prop-types"

import { Button } from "react-bootstrap"

import SearchUiAdv from "./searchUiAdv"
import SearchUiSimple from "./searchUiSimple"

const SearchUI = ({ fieldList, processData, operators, connectors }) => {
  const [isSimple, setIsSimple] = useState(true)

  const onClickSimple = () => setIsSimple(!isSimple)

  if (!fieldList) {
    return (
      <div className="text-danger">
        Parameter <code>fieldList</code> missing! Component{" "}
        <code>SearchUI</code> cannot be initialised
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="text-end">
        <Button onClick={onClickSimple} variant="warning">
          {isSimple && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-filter"
              viewBox="0 0 16 16"
            >
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
            </svg>
          )}
          {!isSimple && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-funnel"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
            </svg>
          )}
        </Button>
      </div>
      {isSimple && (
        <SearchUiSimple fieldList={fieldList} processData={processData} />
      )}
      {!isSimple && (
        <SearchUiAdv
          fieldList={fieldList}
          operators={operators}
          connectors={connectors}
          processData={processData}
        />
      )}
    </React.Fragment>
  )
}

SearchUI.propTypes = {
  /**
   * Required object with list of fields (field_name: field Label) to use for searching
   */
  fieldList: PropTypes.object.isRequired,
  /**
   * Callback function to run on data
   */
  processData: PropTypes.func,

  /**
   * Object with connectors to implement UI in other languages
   */
  operators: PropTypes.object,

  /**
   * Object with connectors to implement UI in other languages
   * Must implement {
   * "_and": "some Label"
   * "_or": "Some Label"
   * }
   */
  connectors: PropTypes.object,
}


export default SearchUI
