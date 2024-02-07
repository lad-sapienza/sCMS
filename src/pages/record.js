import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import Record from "../components/viewRecord"
import getData from "../services/getData"

const RecordPage = ({ location }) => {
  const [recordData, setRecordData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.search)
      const tb = urlParams.get("tb")
      const token = urlParams.get("token")
        ? urlParams.get("token")
        : process.env.GATSBY_DIRECTUS_TOKEN
      const id = urlParams.get("id")
      let dEndPoint = urlParams.get("dEndPoint")

      if (!dEndPoint) {
        if (!process.env.GATSBY_DIRECTUS_ENDPOINT) {
          throw new Error(
            "Missing `dEndPoint` parameter. Provide it as URL parameter of as GATSBY_DIRECTUS_ENDPOINT env variable"
          )
        }
        if (!tb) {
          throw new Error("Missing `tb` parameter")
        }
        dEndPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${tb}`
        throw new Error(
          "Missing `dEndPoint` parameter. Provide it as URL parameter of as GATSBY_DIRECTUS_ENDPOINT env variable"
        )
      }

      if (!token) {
        throw new Error(
          "Missing `token` parameter. Provide it as URL parameter of as GATSBY_DIRECTUS_TOKEN env variable"
        )
      }
      if (!id) {
        throw new Error("Missing `id` parameter")
      }

      getData(`${dEndPoint}/${id}`, token, "json")
        .then(data => {
          setRecordData(data.data)
        })
        .catch(err => {
          setError(err)
        })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [location.search])

  if (loading) {
    return (
      <Layout>
        <div>Caricamento...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div>Errore: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Record item={recordData} />
    </Layout>
  )
}

export default RecordPage
