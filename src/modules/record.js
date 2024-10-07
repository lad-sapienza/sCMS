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
    console.log(error)
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

export { Record }
