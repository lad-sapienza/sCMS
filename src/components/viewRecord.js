import React, { Fragment } from "react"

const Record = ( {item} ) => {

  return <Fragment>
    {Object.entries(item).map((itemEl, index) => (
      <dl key={index}>
        <dt>{itemEl[0]}</dt>
        <dd dangerouslySetInnerHTML={{ __html: typeof(itemEl[1]) === 'string' ? itemEl[1] : `<pre>${JSON.stringify(itemEl[1], null, 2)}</pre>` }}></dd>
      </dl>
    ))}
  </Fragment>
}
export default Record
