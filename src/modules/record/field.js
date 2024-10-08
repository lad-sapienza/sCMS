import React from "react"
import { RecordContext } from "./record"
import getDataFromObj from "../../services/transformers/getDataFromObj"
import PropTypes from "prop-types"

const Field = ({ name }) => {
  const value = React.useContext(RecordContext)

  if (value.length < 1) {
    return <></>
  } else {
    return <>{getDataFromObj(value, name)}</>
  }
}

Field.propTypes = {
  /**
   * Array containing the index or the indices of the data to return
   * Required
   * Example: data = {"one": "One Value", "two": ["Two value #1", "Two value 2"]}
   * name: ["one"] will returjn "One Value" and name: ["two", "1"] will return "Two value 2"
   */
  name: PropTypes.arrayOf(PropTypes.string).isRequired
}

export { Field }
