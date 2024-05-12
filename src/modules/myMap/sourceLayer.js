import React from "react"
import { Source, Layer } from "react-map-gl/maplibre"

const SourceLayer = ({ id, type, data, layerstyle }) => {
  return (
    <Source id={id} type={type} data={data}>
      <Layer {...layerstyle} />
    </Source>
  )
}
export { SourceLayer }
