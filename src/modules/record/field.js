import React from "react"
import { RecordContext } from "./record"
import getDataFromObj from "../../services/transformers/getDataFromObj"
import PropTypes from "prop-types"

const Field = ({ name, transformer }) => {
  const value = React.useContext(RecordContext)

  if (value.length < 1) {
    return <></>
  } else {
    const data = getDataFromObj(value, name);
    if (transformer){
      return transformer(data);
    } else {
      return <>{ typeof data === 'string' ? data : JSON.stringify(data)}</>
    }
  }
}

Field.propTypes = {
  /**
   * Array containing the index or the indices of the data to return
   * Required
   * Example: data = {"one": "One Value", "two": ["Two value #1", "Two value 2"]}
   * name: ["one"] will returjn "One Value" and name: ["two", "1"] will return "Two value 2"
   */
  name: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * A function that received data as input and performs transformation 
   * or any other typo of logic. Can be used, for example, to loop into array of child data.
   * Optional. By default if output data are not a string JSON.stringify will be applied to returned data.
   */
  transformer: PropTypes.func,
}

export { Field }
