import React, { Fragment } from "react"

const Record = ( {item} ) => {

  return <Fragment>
    {Object.entries(item).map((itemEl, index) => (
      <dl key={index}>
        <dt>{itemEl[0]}</dt>
        <dd dangerouslySetInnerHTML={{ __html: itemEl[1] }}></dd>
      </dl>
    ))}
  </Fragment>
}
export default Record
