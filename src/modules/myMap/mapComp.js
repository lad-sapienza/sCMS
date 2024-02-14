import React from "react"
import { MapContainer, LayersControl } from "react-leaflet"
import { BaseLayer } from "./baseLayer"
import {defaultBaseLayers} from "./defaultBaseLayers"

const MapComp = ({ height, center, baseLayers, children }) => {
  if (!center){
    center = '0,0,2';
  }
  let [lng, lat, zoom] = center?.split(',').map(e=> parseFloat(e.trim()))
  
  return (
    <MapContainer
      style={{ height: height ? height : `800px` }}
      scrollWheelZoom={false}
      center={[ lng || 0, lat || 0]}
      zoom={zoom || 2}
    >
      <LayersControl position="topright">
        {baseLayers && baseLayers.split(',').map( (layer, index) => {
          let bl = layer.trim();
          if (!defaultBaseLayers.hasOwnProperty(bl)){return <></>}
            return <BaseLayer
              key={index}
              name={ defaultBaseLayers[bl].name }
              url={ defaultBaseLayers[bl].url }
              attribution={ defaultBaseLayers[bl].attribution ?  defaultBaseLayers[bl].attribution :  null}
              checked={(index === 0)}
            />
        })}
        {children}
      </LayersControl>
    </MapContainer>
  )
}

export { MapComp }
