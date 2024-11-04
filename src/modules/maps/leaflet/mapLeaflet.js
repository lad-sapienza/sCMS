import React from "react"
import PropTypes from "prop-types"

import { MapContainer, LayersControl } from "react-leaflet"

import { RasterLayer } from "./rasterLayer"
import { defaultBaseLayers, defaultBaseLayersPropTypes } from "../defaultBaseLayers"

const MapLeaflet = ({
  height,
  center,
  baseLayers,
  children,
  scrollWheelZoom,
  layersControlPosition,
}) => {
  if (!center) {
    center = "0,0,2"
  }
  if (!layersControlPosition) {
    layersControlPosition = "topright"
  }

  let [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  return (
    <MapContainer
      style={{ height: height ? height : `800px` }}
      scrollWheelZoom={scrollWheelZoom === true ? true : false}
      center={[lng, lat]}
      zoom={zoom}
    >
      <LayersControl
        position={layersControlPosition ? layersControlPosition : null}
      >
        {baseLayers &&
          baseLayers.map((layer, index) => {
            let bl = layer.trim()
            if (!defaultBaseLayers.hasOwnProperty(bl)) {
              return <></>
            }
            return (
              <RasterLayer
                key={index}
                name={defaultBaseLayers[bl].name}
                url={defaultBaseLayers[bl].url}
                attribution={
                  defaultBaseLayers[bl].attribution
                    ? defaultBaseLayers[bl].attribution
                    : null
                }
                checked={index === 0}
              />
            )
          })}
        {children}
      </LayersControl>
    </MapContainer>
  )
}

MapLeaflet.propTypes = {
  /**
   * Height (with unit) of the map element: default: 800px
   */
  height: PropTypes.string,
  /**
   * Center of the map, as a string with long, lat and zoom separated by commas: default to 0,0,2
   */
  center: PropTypes.string,
  /**
   * Array with default baselayers to show
   */
  baseLayers: defaultBaseLayersPropTypes,
  /**
   * Children elements
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  /**
   * Boolean to controle if wheel zoom is active or not. Default false
   */
  scrollWheelZoom: PropTypes.bool,
  /**
   * Position of the layers control
   */
  layersControlPosition: PropTypes.oneOf([
    "topright",
    "topleft",
    "bottomright",
    "bottomleft",
  ]),
}

export { MapLeaflet }
