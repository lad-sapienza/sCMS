import React from "react"
import { RecordContext } from "../record"
import getDataFromObj from "../../services/transformers/getDataFromObj"

const Field = ({ name }) => {
  const value = React.useContext(RecordContext)

  if (value.length < 1) {
    return <></>
  } else {
    return <>{getDataFromObj(value, name)}</>
  }
}

export { Field }
