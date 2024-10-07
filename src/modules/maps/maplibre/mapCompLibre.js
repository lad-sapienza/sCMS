import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
  Source,
  Layer,
} from "react-map-gl/maplibre"
import ControlPanel from "./controlPanel"
import { defaultBaseLayers } from "../../maps/defaultBaseLayers"
import SearchUI from "../../search/searchUI.js"
import plain2maplibre from "../../../services/transformers/plain2maplibre.js"

const MapCompLibre = ({
  children,
  height,
  center,
  interactiveLayerIds = [],
  styleJson,
  fieldList,
}) => {
  const [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  const [mapStyle, setMapStyle] = useState(
    styleJson || "https://demotiles.maplibre.org/style.json",
  ) // Stile di default

  const [mapInstance, setMapInstance] = useState(null) // Stato per memorizzare la mappa
  const [filters, setFilters] = useState([]) // Stato per memorizzare i filtri
  const [clickInfo, setClickInfo] = useState(null)

  // Funzione per processare i dati della ricerca
  const processData = (conn, inputs) => {
    const mapLibreFilters = plain2maplibre(conn, inputs) // Converte i filtri per MapLibre
    setFilters(mapLibreFilters) // Salva i filtri nello stato
    console.log("Generated filters in processData:", mapLibreFilters) // Log per verificare i filtri generati
  }

  // useEffect per aggiornare i filtri sui layer interattivi quando i filtri cambiano
  useEffect(() => {
    if (mapInstance && filters.length > 0 && interactiveLayerIds.length > 0) {
      interactiveLayerIds.forEach(layerId => {
        mapInstance.setFilter(layerId, filters) // Applica i filtri a ciascun layer
        console.log("Filters applied to layer:", layerId, filters) // Debug
      })
    }
  }, [mapInstance, filters, interactiveLayerIds])

  // Callback per ottenere l'istanza della mappa
  const onMapLoad = e => {
    setMapInstance(e.target) // Memorizza l'istanza della mappa
  }

  const handleLayerChange = styleUrl => {
    setMapStyle(styleUrl)
  }

  const onClick = useCallback(
    event => {
      const { features } = event
      // Filtra solo i feature dai layer interattivi
      const clickedFeature = features.find(feature =>
        interactiveLayerIds.includes(feature.layer.id),
      )

      setClickInfo(clickedFeature ? { feature: clickedFeature } : null)
    },
    [interactiveLayerIds],
  )

  return (
    <React.Fragment>
      {/* Integra l'interfaccia di ricerca */}
      <SearchUI
        fieldList={fieldList}
        processData={processData} // Passa la funzione processData per elaborare i filtri
      />
      {/* Verifica i filtri prima di passare a SourceLayer */}
      {console.log(
        "Filters being passed to SourceLayer:",
        JSON.stringify(filters, null, 2),
      )}
      <Map
        initialViewState={{
          longitude: lng ? lng : 0,
          latitude: lat ? lat : 0,
          zoom: zoom ? zoom : 2,
        }}
        style={{ height: height ? height : `800px` }}
        mapStyle={mapStyle}
        interactiveLayerIds={interactiveLayerIds} // Passa l'array di layer interattivi
        onClick={onClick}
        onLoad={onMapLoad}
      >
        {/* Passa filters e mapInstance ai figli (SourceLayer) */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            console.log("Passing filters to child:", filters)
            console.log("Passing layerId:", interactiveLayerIds) // Log per verificare il layerId

            // Usa React.cloneElement per passare filters e layerId
            return React.cloneElement(child, {
              filters, // Passa i filtri a SourceLayer
              mapInstance, // Passa l'istanza della mappa
              layerId:
                interactiveLayerIds.length > 0 ? interactiveLayerIds : null, // Passa l'id del layer interattivo
            })
          }
          return child
        })}

        <Source id="basemap" type="raster" tiles={[mapStyle]} tileSize={256} />
        <Layer id="basemap-layer" type="raster" source="basemap" />

        {clickInfo && (
          <Popup
            anchor="top"
            longitude={Number(clickInfo.feature.geometry.coordinates[0])}
            latitude={Number(clickInfo.feature.geometry.coordinates[1])}
            onClose={() => setClickInfo(null)}
          >
            <div>
              {clickInfo.feature.properties &&
                JSON.stringify(clickInfo.feature.properties, null, 2)}
            </div>
          </Popup>
        )}
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        <ControlPanel
          position="top-right"
          baseLayers={defaultBaseLayers}
          selectedLayer={mapStyle}
          onLayerChange={handleLayerChange}
        />
      </Map>
    </React.Fragment>
  )
}

export { MapCompLibre }
