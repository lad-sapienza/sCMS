import React from "react"
import { RecordContext } from "../record"

const Field = ({ name, name2, name3, name4, name5, name6 }) => {
  const value = React.useContext(RecordContext)

  if (value.length === 0){
    return <></>
  }
  let ret = null

  if (name6) {
    ret = value[name][name2][name3][name4][name5][name6]
  } else if (name5) {
    ret = value[name][name2][name3][name4][name5]
  } else if (name4) {
    ret = value[name][name2][name3][name4]
  } else if (name3) {
    ret = value[name][name2][name3]
  } else if (name2) {
    ret = value[name][name2]
  } else {
    ret = value[name]
  }

  return (
    <React.Fragment>
      {typeof ret === "string" ? ret : JSON.stringify(ret)}
    </React.Fragment>
  )
}

export { Field }
