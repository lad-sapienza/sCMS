import React, { useRef, useEffect, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const Map = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng] = useState(41.280761)
  const [lat] = useState(19.935146)
  const [zoom] = useState(2)

  useEffect(() => {
    if (map.current) return // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://demotiles.maplibre.org/style.json`,
      center: [lng, lat],
      zoom: zoom,
    })
    // Add navigation control to the bottom-right corner of the map
    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right")
  }, [lng, lat, zoom])

  return (
    <div className="map-wrap" style={{ width: "100%", height: "400px" }}>
      <div
        ref={mapContainer}
        className="map"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}

export { Map }
