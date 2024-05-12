import * as React from "react"
import Map, { NavigationControl } from "react-map-gl/maplibre"

// {children è fondamentale per avere il render di <SourceLayer/>
const Map2 = ({ children }) => {
  const initialViewState = {
    longitude: 12.4964,
    latitude: 41.9028,
    zoom: 8,
  }
  const style = { width: "100%", height: 400 }
  const mapStyle = "https://demotiles.maplibre.org/style.json"

  return (
    <Map initialViewState={initialViewState} style={style} mapStyle={mapStyle}>
      {children}
      <NavigationControl />
    </Map>
  )
}

export { Map2 }
