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
  fieldList,
  mapInstance, // L'istanza della mappa, necessaria per applicare i filtri ai layer definiti nello style.json
  styleLayerIds, // Lista degli ID dei layer caricati da style.json
}) => {
  const [geojsonData, setGeojson] = useState(null) // GeoJSON data
  const [filteredData, setFilteredData] = useState(null) // Dati filtrati
  const [filters, setFilters] = useState([]) // Stato per i filtri generati
  const [error, setError] = useState(false)

  // Funzione per ottenere i dati da getData (se non sono nel style.json)
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
        setGeojson(geoJSON) // Imposta i dati geoJSON originali
        setFilteredData(geoJSON) // Imposta i dati filtrati uguali agli originali inizialmente
        console.log("Dati GeoJSON caricati:", geoJSON)
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        setError("Errore nel caricamento dei dati")
      }
    }

    fetchGeoData() // Carica i dati quando il componente è montato
  }, [path2data, dEndPoint, dTable, dToken, dQueryString, geoField])

  // useEffect per applicare i filtri sia ai dati GeoJSON che ai layer definiti in style.json
  useEffect(() => {
    if (geojsonData && filters && filters.length > 0) {
      // Filtraggio dei dati GeoJSON
      const filtered = geojsonData.features.filter(feature => {
        return filters.some(filter => {
          const operator = filter[0] // Ottieni l'operatore (es. "==")
          const field = filter[1][1] // Ottieni il nome del campo (es. "Item_Label")
          const value = filter[2] // Ottieni il valore da confrontare

          // Verifica se fieldList è un oggetto e contiene il campo come chiave
          if (!fieldList || !Object.keys(fieldList).includes(field)) {
            console.log(
              `Campo ${field} non presente in fieldList, salto il filtro.`,
            )
            return false
          }

          const property = feature.properties[field] // Ottieni la proprietà corretta

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

      setFilteredData({ ...geojsonData, features: filtered }) // Aggiorna i dati filtrati
      console.log("Dati filtrati localmente:", filtered)
    } else {
      setFilteredData(geojsonData) // Se non ci sono filtri, mostra i dati originali
    }

    // Applicare i filtri ai layer definiti nello style.json
    if (
      mapInstance &&
      filters &&
      filters.length > 0 &&
      styleLayerIds &&
      Array.isArray(styleLayerIds)
    ) {
      styleLayerIds.forEach(layerId => {
        mapInstance.setFilter(layerId, filters) // Applica i filtri al layer specificato
        console.log(`Filtri applicati al layer ${layerId}:`, filters)
      })
    }
  }, [filters, geojsonData, fieldList, mapInstance, styleLayerIds])

  if (error) {
    return <div>{error}</div>
  } else if (!geojsonData && !styleLayerIds) {
    return <div>Caricamento dati...</div>
  } else {
    const dataToShow =
      filters && filters.length > 0 ? filteredData : geojsonData // Mostra i dati filtrati o tutti i dati
    return (
      <div>
        {/* Mostra il Source solo se ci sono dati GeoJSON */}
        {geojsonData && (
          <Source id={id} type={type} data={dataToShow}>
            <Layer {...layerstyle} />
          </Source>
        )}
      </div>
    )
  }
}

export { SourceLayer }
