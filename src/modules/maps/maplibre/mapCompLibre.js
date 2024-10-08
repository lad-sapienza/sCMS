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

const MapCompLibre = ({
  children,
  height,
  center,
  interactiveLayerIds = [],
  styleJson,
}) => {
  const [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  const [mapStyle, setMapStyle] = useState(
    styleJson || "https://demotiles.maplibre.org/style.json",
  ) // Stile di default

  const [clickInfo, setClickInfo] = useState(null)

  // Stato per gestire i source layer visibili
  const [visibleSourceLayers, setVisibleSourceLayers] = useState({})
  const [styleLayers, setStyleLayers] = useState([]) // Stato per i layer dal JSON
  const [visibleLayers, setVisibleLayers] = useState({}) // Stato per la visibilità dei layer

  const handleLayerChange = styleUrl => {
    setMapStyle(styleUrl)
  }

  const toggleLayerVisibility = layerId => {
    setVisibleSourceLayers(prevState => ({
      ...prevState,
      [layerId]: !prevState[layerId],
    }))
  }

  const toggleStyleLayerVisibility = layerId => {
    setVisibleLayers(prevState => ({
      ...prevState,
      [layerId]: !prevState[layerId],
    }))
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

  // Effetto per caricare i layer dal file di stile JSON
  useEffect(() => {
    const fetchStyle = async () => {
      try {
        const response = await fetch(styleJson)
        const styleData = await response.json()

        // Verifica se ci sono layer nel file di stile JSON
        const layers =
          styleData.layers && Array.isArray(styleData.layers)
            ? styleData.layers.map(layer => ({
                id: layer.id,
                name: layer.id, // Puoi cambiare il nome se necessario
              }))
            : [] // Se non ci sono layer, imposta un array vuoto

        setStyleLayers(layers) // Imposta i layer dallo stile JSON o un array vuoto
      } catch (error) {
        console.error("Errore nel caricamento dello stile JSON:", error)
        setStyleLayers([]) // Se c'è un errore, imposta un array vuoto
      }
    }

    if (styleJson) {
      fetchStyle() // Carica solo se c'è un file di stile JSON
    }
  }, [styleJson])

  return (
    <React.Fragment>
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
      >
        {/* Condizionalmente rendi visibili i SourceLayer basati sul loro stato */}
        {React.Children.map(children, child => {
          if (visibleSourceLayers[child.props.id] !== false) {
            return child
          }
          return null
        })}

        {/* Applica i layer dal file di stile JSON solo se presenti */}
        {styleLayers &&
          styleLayers.length > 0 &&
          styleLayers.map(
            layer =>
              visibleLayers[layer.id] !== false && (
                <Layer key={layer.id} id={layer.id} {...layer} />
              ),
          )}

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
          // Combina i SourceLayer definiti manualmente e quelli dal file JSON
          sourceLayers={[
            ...(children
              ? React.Children.map(children, child => ({
                  id: child.props.id,
                  name: child.props.layerstyle.id, // Nome personalizzabile
                }))
              : []),
            ...styleLayers.map(layer => ({
              id: layer.id,
              name: layer.name,
            })),
          ]}
          onToggleLayer={layerId => {
            toggleLayerVisibility(layerId)
            toggleStyleLayerVisibility(layerId)
          }}
        />
      </Map>
    </React.Fragment>
  )
}

export { MapCompLibre }
