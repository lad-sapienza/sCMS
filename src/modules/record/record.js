import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import withLocation from "../../services/withLocation"
import getDataFromSource from "../../services/getDataFromSource"

export const RecordContext = React.createContext()

const RecordNotWrapped = ({ search, children }) => {
  const { tb, endPoint, token, id } = search
  const [recordData, setRecordData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      setLoading(true)
      getDataFromSource({
        dEndPoint: endPoint,
        dTable: tb,
        transType: "json",
        id: id,
      })
        .then(d => {
          setRecordData(d)
        })
        .catch(err => {
          setError(err)
        })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [endPoint, tb, token, id])

  if (loading) {
    return <div className="text-info">Loading...</div>
  }
  if (error) {
    return (
      <div className="text-danger">
        {error.message}
        <br />
        More info in the console log
      </div>
    )
  }
  if (recordData.length < 1) {
    return <div className="text-warning">No result found</div>
  } else {
    return (
      <RecordContext.Provider value={recordData}>
        {children}
      </RecordContext.Provider>
    )
  }
}

const Record = withLocation(RecordNotWrapped)

Record.propTypes = {
  /**
   * Object with access data
   */
  search: PropTypes.shape({
    /**
     * Directus table name
     */
    tb: PropTypes.string,
    /**
     * Directus endpoint, if env variable GATSBY_DIRECTUS_ENDPOINT is not available
     */
    endPoint: PropTypes.string,
    /**
     * Directus endpoint, if env variable GATSBY_DIRECTUS_TOKEN is not available
     */
    token: PropTypes.string,
    /**
     * Record id
     */
    id: PropTypes.number,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}
export { Record }
