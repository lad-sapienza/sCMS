import React, { useState } from "react"
import PropTypes from "prop-types"

import { Button } from "react-bootstrap"

import { Filter, Funnel } from "react-bootstrap-icons"

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
            <Filter />
          )}
          {!isSimple && (
            <Funnel />
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
