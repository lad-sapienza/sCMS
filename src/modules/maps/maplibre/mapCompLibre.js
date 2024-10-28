import * as React from "react"
import { useState, useCallback, useRef } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
} from "react-map-gl/maplibre"
import PropTypes, { arrayOf } from "prop-types"
import ControlPanel from "./controlPanel"
import SimpleControl from "./simpleControl"
import { RasterLayerLibre } from "./rasterLayerLibre"
import { defaultBaseLayers } from "../../maps/defaultBaseLayers"
import parseStringTemplate from "../../../services/parseStringTemplate"


const MapCompLibre = ({
  children,
  height,
  center,
  mapStyle,
  geolocateControl,
  fullscreenControl,
  navigationControl,
  scaleControl,
  baseLayers,
}) => {
  const [lng, lat, zoom] = center
    ? center.split(",").map(e => parseFloat(e.trim()))
    : [0, 0, 2]

  const [mapStyleUrl, setMapStyleUrl] = useState(
    mapStyle,
    // ||
    // "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json",
    //"https://demotiles.maplibre.org/style.json",
  )

  const [clickInfo, setClickInfo] = useState(null)
  const interactiveLayersRef = useRef([])

  const handleLayerChange = styleUrl => {
    setMapStyleUrl(styleUrl)
  }

  const onMapLoad = useCallback(event => {
    const mapInstance = event.target

    // test custom control
    const customControl = new SimpleControl()
    mapInstance.addControl(customControl, "top-right")

    // Usa map per scorrere i layer e filtrare quelli con metadata.popupTemplate
    const dynamicInteractiveLayers = mapInstance
      .getStyle()
      .layers.map(layer =>
        layer.metadata && layer.metadata.popupTemplate ? layer.id : null,
      )
      .filter(Boolean) // Rimuove i valori null

    // Salva i layer interattivi nella variabile di riferimento
    interactiveLayersRef.current = dynamicInteractiveLayers
  }, [])

  const onClick = useCallback(event => {
    const { lngLat, point } = event
    const mapInstance = event.target

    // Usa queryRenderedFeatures per ottenere le feature dal punto cliccato
    const clickedFeatures = mapInstance.queryRenderedFeatures(point, {
      layers: interactiveLayersRef.current,
    })

    const clickedFeature = clickedFeatures.find(feature =>
      interactiveLayersRef.current.includes(feature.layer.id),
    )

    setClickInfo(
      clickedFeature ? { feature: clickedFeature, lngLat: lngLat } : null,
    )
  }, [])

  // Filtra i base layers in base alla proprietà `baseLayers`
  const filteredBaseLayers = baseLayers
    ? baseLayers
        .map(lyr => (defaultBaseLayers[lyr] ? defaultBaseLayers[lyr] : null))
        .filter(x => x)
    : []

  return (
    <React.Fragment>
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom,
        }}
        style={{ height: height ? height : `800px` }}
        mapStyle={mapStyleUrl}
        onLoad={onMapLoad}
        onClick={onClick}
      >
        {filteredBaseLayers &&
          filteredBaseLayers.map((obj, i) => (
            <RasterLayerLibre
              key={i}
              name={obj.name}
              url={[obj.url]}
              checked={i === 0}
              attribution={obj.attribution}
            />
          ))}

        {children}
        {clickInfo && clickInfo.feature.layer.metadata.popupTemplate && (
          <Popup
            anchor="top"
            longitude={clickInfo.lngLat.lng}
            latitude={clickInfo.lngLat.lat}
            onClose={() => setClickInfo(null)}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: parseStringTemplate(
                  clickInfo.feature.layer.metadata.popupTemplate,
                  clickInfo.feature.properties,
                ),
              }}
            />
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

        {/* <ControlPanel
          position="top-right"
          baseLayers={filteredBaseLayers}
          selectedLayer={mapStyleUrl}
          onLayerChange={handleLayerChange}
        /> */}
      </Map>
    </React.Fragment>
  )
}
MapCompLibre.propTypes = {
  height: PropTypes.string,
  center: PropTypes.string,
  mapStyle: PropTypes.string,
  geolocateControl: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
  fullscreenControl: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
  navigationControl: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
  scaleControl: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
  baseLayers: arrayOf(PropTypes.string),
}

export { MapCompLibre }
