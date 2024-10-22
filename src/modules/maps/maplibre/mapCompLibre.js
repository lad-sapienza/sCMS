import * as React from "react"
import { useState, useCallback } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
} from "react-map-gl/maplibre"
import ControlPanel from "./controlPanel"
import { defaultBaseLayers } from "../../maps/defaultBaseLayers"

const MapCompLibre = ({
  children,
  height,
  center,
  interactiveLayerIds = [],
  mapStyle,
  geolocateControl,
  fullscreenControl,
  navigationControl,
  scaleControl,
}) => {
  /**
   * TODO: @eiacopini
   const lyrList = [
    {
    "name": "=> controlPanel"
    "popUpTmpl": "=> fn => PopUp"
   }
   ];
   */
  const [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  const [mapStyleUrl, setMapStyleUrl] = useState(
    mapStyle || "https://demotiles.maplibre.org/style.json",
  ) // Stile di default https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json

  const [clickInfo, setClickInfo] = useState(null)

  const lyrList = React.Children.map(children, child => {
    return {
      id: child.props.style.id,
      name: child.props.name,
      checked: child.props.checked,
      fitToContent: child.props.fitToContent,
      popUpTmpl: child.props.popUpTmpl,
    }
  })

  const handleLayerChange = styleUrl => {
    setMapStyleUrl(styleUrl)
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
        mapStyle={mapStyleUrl}
        interactiveLayerIds={interactiveLayerIds} // Passa l'array di layer interattivi
        onClick={onClick}
      >
        {children}

        {clickInfo && (
          <Popup
            anchor="top"
            longitude={Number(clickInfo.feature.geometry.coordinates[0])}
            latitude={Number(clickInfo.feature.geometry.coordinates[1])}
            onClose={() => setClickInfo(null)}
          >
            <div>
              {/* Usa `popUpTmpl` dal `lyrList` o mostra i dati grezzi se non c'è popUpTmpl */}
              {lyrList.find(layer => layer.id === clickInfo.feature.layer.id)
                ?.popUpTmpl
                ? lyrList
                    .find(layer => layer.id === clickInfo.feature.layer.id)
                    .popUpTmpl(clickInfo.feature.properties)
                : JSON.stringify(clickInfo.feature.properties, null, 2)}
            </div>
          </Popup>
        )}

        {geolocateControl && <GeolocateControl position={geolocateControl} />}
        {fullscreenControl && (
          <FullscreenControl position={fullscreenControl} />
        )}
        {navigationControl && (
          <NavigationControl position={navigationControl} />
        )}
        {scaleControl && <ScaleControl position={scaleControl} />}

        <ControlPanel
          position="top-right"
          baseLayers={defaultBaseLayers}
          selectedLayer={mapStyleUrl}
          onLayerChange={handleLayerChange}
          layerList={lyrList}
        />
      </Map>
    </React.Fragment>
  )
}

export { MapCompLibre }
