import * as React from "react"
import { useState, useCallback } from "react"
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

  // Verifica se ci sono children e se possono essere mappati correttamente
  const [visibleSourceLayers, setVisibleSourceLayers] = useState(
    children
      ? React.Children.map(children, child => ({
          id: child.props.id,
          visible: true, // Inizialmente tutti visibili
          ...child.props,
        }))
      : [], // Fallback nel caso non ci siano children
  )

  // Funzione per cambiare il layer (sia baseLayers che sourceLayers)
  const handleLayerChange = (layerId, type = "base") => {
    if (type === "base") {
      // Cambio dello stile della mappa
      setMapStyle(layerId)
    } else {
      // Cambio della visibilità dei sourceLayers
      setVisibleSourceLayers(prev =>
        prev.map(layer =>
          layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
        ),
      )
    }
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
        {/* Render dei base layers */}
        <Source id="basemap" type="raster" tiles={[mapStyle]} tileSize={256} />
        <Layer id="basemap-layer" type="raster" source="basemap" />

        {/* Render dei sourceLayers basati sulla loro visibilità */}
        {visibleSourceLayers.map(
          layer =>
            layer.visible && (
              <Source key={layer.id} id={layer.id} {...layer}>
                <Layer {...layer.layerstyle} />
              </Source>
            ),
        )}
        {children}

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
          sourceLayers={children}
          onLayerChange={handleLayerChange}
        />
      </Map>
    </React.Fragment>
  )
}

export { MapCompLibre }
