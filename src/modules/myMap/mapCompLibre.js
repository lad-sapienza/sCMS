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
import { defaultBaseLayers } from "../maps/defaultBaseLayers"

// Importa i componenti di ricerca
import Search from "../search"

const MapCompLibre = ({
  children,
  height,
  center,
  interactiveLayerIds = [],
  styleJson,
  fieldList,
  operators,
  connector,
}) => {
  const [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  const [mapStyle, setMapStyle] = useState(
    styleJson || "https://demotiles.maplibre.org/style.json",
  ) // Default style

  const handleLayerChange = styleUrl => {
    setMapStyle(styleUrl)
  }

  const [clickInfo, setClickInfo] = useState(null)
  //const [searchTerm, setSearchTerm] = useState("")
  const [mapInstance, setMapInstance] = useState(null) // Stato per memorizzare la mappa

  // const handleSearchChange = event => {
  //   setSearchTerm(event.target.value)
  // }

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
      <Search
        fieldList={fieldList}
        operators={operators}
        connector={connector}
      />
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
        onLoad={event => setMapInstance(event.target)} // Setta l'istanza della mappa quando è caricata
      >
        {children}
        {/* Passa searchTerm e mapIstance a SourceLayer */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { mapInstance })
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
              {/* Visualizza le proprietà del feature cliccato */}
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
