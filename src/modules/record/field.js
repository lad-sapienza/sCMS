import React from "react"
import { RecordContext } from "../record"

const Field = ({ name, name2, name3, name4, name5, name6 }) => {
  const value = React.useContext(RecordContext)

  let ret = null

  if (value.length < 1) {
    return <></>
  } else {
    if (
      name &&
      value[name] !== "undefined" &&
      name2 &&
      value[name][name2] !== "undefined" &&
      name3 &&
      value[name][name2][name3] !== "undefined" &&
      name4 &&
      value[name][name2][name3][name4] !== "undefined" &&
      name5 &&
      value[name][name2][name3][name4][name5] !== "undefined" &&
      name6 &&
      value[name][name2][name3][name4][name5][name6] !== "undefined"
    ) {
      ret = value[name][name2][name3][name4][name5][name6]
    } else if (
      name &&
      value[name] !== "undefined" &&
      name2 &&
      value[name][name2] !== "undefined" &&
      name3 &&
      value[name][name2][name3] !== "undefined" &&
      name4 &&
      value[name][name2][name3][name4] !== "undefined" &&
      name5 &&
      value[name][name2][name3][name4][name5] !== "undefined"
    ) {
      ret = value[name][name2][name3][name4][name5]
    } else if (
      name &&
      value[name] !== "undefined" &&
      name2 &&
      value[name][name2] !== "undefined" &&
      name3 &&
      value[name][name2][name3] !== "undefined" &&
      name4 &&
      value[name][name2][name3][name4] !== "undefined"
    ) {
      ret = value[name][name2][name3][name4]
    } else if (
      name &&
      value[name] !== "undefined" &&
      name2 &&
      value[name][name2] !== "undefined" &&
      name3 &&
      value[name][name2][name3] !== "undefined"
    ) {
      ret = value[name][name2][name3]
    } else if (
      name &&
      value[name] !== "undefined" &&
      name2 &&
      value[name][name2] !== "undefined"
    ) {
      ret = value[name][name2]
    } else if (name && value[name] !== "undefined") {
      ret = value[name]
    }
  }

  return (
    <React.Fragment>
      {typeof ret === "string" ? ret : JSON.stringify(ret)}
    </React.Fragment>
  )
}

export { Field }
