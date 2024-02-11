import React from "react"
import { TileLayer,LayersControl } from "react-leaflet"

const BaseLayer = ({
  name,
  checked,
  url,
  attribution
}) => {
  
  return (
    <LayersControl.BaseLayer
      checked={ checked }
      name={ name}
    >
      <TileLayer
        url={url}
        attribution={attribution ? attribution : false}
      />
    </LayersControl.BaseLayer>
  )
}

export { BaseLayer }
