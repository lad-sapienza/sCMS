import React, { useState, useEffect } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import getData from "../../../services/getData" // Importa la tua funzione getData

const SourceLayer = ({
  id,
  type,
  path2data,
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  geoField,
  layerstyle,
  filters,
  mapInstance,
  layerId,
}) => {
  const [geojsonData, setGeojson] = useState(null) // GeoJSON data
  const [filteredData, setFilteredData] = useState(null) // Dati filtrati
  const [error, setError] = useState(false)

  // Funzione per ottenere i dati da getData
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const geoJSON = await getData({
          path2data,
          dEndPoint,
          dTable,
          dToken,
          dQueryString,
          transType: "geojson",
          geoField,
        })
        setGeojson(geoJSON) // Imposta i dati geoJSON
        console.log("Dati GeoJSON caricati:", geoJSON)
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        setError("Errore nel caricamento dei dati")
      }
    }

    fetchGeoData() // Carica i dati quando il componente è montato
  }, [path2data, dEndPoint, dTable, dToken, dQueryString, geoField])

  // useEffect per applicare i filtri
  useEffect(() => {
    console.log("filters in SourceLayer:", filters) // Verifica i filtri ricevuti
    console.log("layerId in SourceLayer:", layerId) // Verifica il layerId ricevuto

    if (mapInstance && filters && filters.length > 0 && geojsonData) {
      if (layerId && Array.isArray(layerId) && layerId.length > 0) {
        layerId.forEach(id => {
          mapInstance.setFilter(id, filters) // Applica i filtri al layer
          console.log("Filtri applicati al layer:", id, filters)
        })
      } else {
        console.error("layerId non valido o vuoto:", layerId)
      }

      // Logica di filtraggio locale
      const filtered = geojsonData.features.filter(feature => {
        return filters.some(filter => {
          const operator = filter[0] // Ottieni l'operatore (es. "==")
          const field = filter[1][1] // Ottieni il nome del campo (es. "Item_Label")
          const value = filter[2] // Ottieni il valore (es. "KM 198")

          const property = feature.properties[field] // Ottieni la proprietà corretta

          // console.log(
          //   `Confronto per ${field}: ${property} ${operator} ${value}`,
          // )

          // Applica l'operatore di confronto
          switch (operator) {
            case "==":
              return property === value
            case "!=":
              return property !== value
            case ">":
              return property > value
            case "<":
              return property < value
            case ">=":
              return property >= value
            case "<=":
              return property <= value
            default:
              return false // Se l'operatore non è gestito, ignora il filtro
          }
        })
      })

      setFilteredData({ ...geojsonData, features: filtered })
      console.log("Dati filtrati localmente:", filtered)
    } else {
      setFilteredData(geojsonData) // Se non ci sono filtri, mostra i dati originali
    }
  }, [filters, mapInstance, layerId, geojsonData])

  if (error) {
    return <div>{error}</div>
  } else if (!geojsonData) {
    return <div>Caricamento dati...</div>
  } else {
    const dataToShow =
      filters && filters.length > 0 ? filteredData : geojsonData // Mostra i dati filtrati o tutti i dati
    return (
      <>
        <Source id={id} type={type} data={dataToShow}>
          <Layer {...layerstyle} />
        </Source>
      </>
    )
  }
}

export { SourceLayer }
