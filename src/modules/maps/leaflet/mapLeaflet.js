import React from "react"
import PropTypes from "prop-types"

import { MapContainer, LayersControl } from "react-leaflet"

import { RasterLayer } from "./rasterLayer"
import { defaultBaseLayers, defaultBaseLayersPropTypes } from "../defaultBaseLayers"

const MapLeaflet = ({
  height = "800px",
  center = "0,0,2",
  baseLayers = [],
  children,
  scrollWheelZoom = false,
  layersControlPosition = "topright",
}) => {
  // Parse center as [lat, lng, zoom] for Leaflet
  let [lat, lng, zoom] = center.split(",").map(e => parseFloat(e.trim()))
  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
    [lat, lng, zoom] = [0, 0, 2]
  }

  // Filter out invalid baseLayers before mapping
  const validBaseLayers = baseLayers
    ? baseLayers.filter(layer => defaultBaseLayers.hasOwnProperty(layer.trim()))
    : []

  return (
    <MapContainer
      style={{ height }}
      scrollWheelZoom={scrollWheelZoom}
      center={[lat, lng]}
      zoom={zoom}
    >
      <LayersControl position={layersControlPosition}>
        {validBaseLayers.map((layer, index) => {
          const bl = layer.trim()
          const base = defaultBaseLayers[bl]
          return (
            <RasterLayer
              key={bl}
              name={base.name}
              url={base.url}
              attribution={base.attribution || null}
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
   * Height (with unit) of the map element.
   * Optional, default: 800px
   */
  height: PropTypes.string,
  /**
   * Center of the map, as a string with lat, lng and zoom separated by commas.
   * Optional, default: "0,0,2"
   */
  center: PropTypes.string,
  /**
   * Array with default baselayers to show
   * Optional
   */
  baseLayers: defaultBaseLayersPropTypes,
  /**
   * Children elements
   * Optional
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  /**
   * Boolean to control if wheel zoom is active or not.
   * Optional, default: false
   */
  scrollWheelZoom: PropTypes.bool,
  /**
   * Position of the layers control
   * Optional, default: "topright"
   */
  layersControlPosition: PropTypes.oneOf([
    "topright",
    "topleft",
    "bottomright",
    "bottomleft",
  ]),
}

export { MapLeaflet }
