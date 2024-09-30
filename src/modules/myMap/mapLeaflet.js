import React from "react"
import { MapContainer, LayersControl } from "react-leaflet"
import { RasterLayer } from "./rasterLayer"
import { defaultBaseLayers } from "../maps/defaultBaseLayers"

const MapLeaflet = ({ height, center, baseLayers, children, scrollWheelZoom, layersControlPosition }) => {
  
  let [lng, lat, zoom] = center?.split(",").map(e => parseFloat(e.trim()))

  return (
    <MapContainer
      style={{ height: height ? height : `800px` }}
      scrollWheelZoom={scrollWheelZoom === true ? true : false}
      center={[lng || 0, lat || 0]}
      zoom={zoom || 2}
    >
      <LayersControl position={ layersControlPosition ? layersControlPosition : null }>
        {baseLayers &&
          baseLayers.split(",").map((layer, index) => {
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

export { MapLeaflet }
