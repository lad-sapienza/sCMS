import React, { useEffect, useState } from "react"
import withLocation from "./record/withLocation"
import getData from "../services/getData"

export const RecordContext = React.createContext()

const RecordNotWrapped = ({ search, children }) => {
  const { tb, endPoint, token, id } = search
  const [recordData, setRecordData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      setLoading(true)
      getData({
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
    return <div className="text-danger">{error}</div>
  }

  return (
    <RecordContext.Provider value={recordData}>
      { children }
    </RecordContext.Provider>
  )
}

const Record = withLocation(RecordNotWrapped)
export { Record }
