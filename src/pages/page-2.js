import * as React from "react"
import { useState, useEffect } from "react"

import Layout from "../components/layout"
import { Seo } from "../components/seo"

const SecondPage = () => {
  // ----------------------
  // RUNTIME DATA FETCHING
  // ----------------------

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = process.env.GATSBY_DIRECTUS_TOKEN
    const headers = {
      Authorization: `Bearer ${token}`,
      // Puoi aggiungere altre intestazioni qui, se necessario
    }

    fetch("/db/items/cms_articles", {
      method: "GET",
      headers: headers,
      // Rimuovi la modalità "no-cors" se non è necessaria
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(resultData => {
        setData(resultData.data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <Layout>
      <div>
        <h1>Articoli di Directus</h1>
        <ul>
          {data.map(article => (
            <li key={article.id}>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              {/* Puoi aggiungere ulteriori dettagli o formattazione qui, come le immagini o il testo completo dell'articolo */}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
export default SecondPage

export const Head = () => <Seo title="Page two" />
