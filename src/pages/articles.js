import React, { useState, useEffect } from "react"
import Layout from "../components/layout"

const ToponimoPage = ({ location }) => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getFilteredData = async () => {
      try {
        // Ottieni il parametro toponimo dalla query string
        const toponimo = new URLSearchParams(location.search).get("toponimo")

        // Verifica se il parametro è presente
        if (!toponimo) {
          throw new Error("Parametro toponimo mancante")
        }

        const response = await fetch(
          `https://landscapearchaeology.eu/db/${process.env.GATSBY_DIRECTUS_MAP_ENDPOINT}?filter[toponimo][_icontains]=${toponimo}`,

          {
            headers: {
              Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_MAP_TOKEN}`,
            },
          }
        )
        const result = await response.json()
        setFilteredData(result.data || [])
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    getFilteredData()
  }, [location.search])

  if (loading) {
    return <div>Caricamento...</div>
  }

  if (error) {
    return <div>Errore: {error.message}</div>
  }

  // Renderizza la tua pagina con i dati filtrati
  return (
    <Layout>
      <div>
        {/* Renderizza qui i dati filtrati come desideri */}
        {filteredData.map(item => (
          <div key={item.id}>
            <h1>{item.toponimo}</h1>
            <div>{item.etimologia}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default ToponimoPage
