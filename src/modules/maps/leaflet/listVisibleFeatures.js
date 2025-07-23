import React, { useState } from "react"
import PropTypes from "prop-types"
import { useMapEvent } from "react-leaflet/hooks"
import L from "leaflet"

const getFeaturesInView = map => {
  const features = []
  map.eachLayer(function (lyr) {
    if (lyr instanceof L.Marker) {
      if (map.getBounds().contains(lyr.getLatLng())) {
        features.push(lyr.feature)
      }
    }
  })
  return features
}

const ListVisibleFeatures = ({ elTemplate = () => null }) => {
  const [lyrList, setLyrList] = useState([])

  const map = useMapEvent("moveend", () => {
    setLyrList(getFeaturesInView(map))
  })

  if (lyrList.length === 0) {
    return null
  }

  // Use a robust key: prefer feature.id, fallback to index
  return (
    <div>
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control leaflet-bar m-1 p-1" style={{
          maxHeight: '200px',
          overflow: 'auto',
          background: 'rgba(255, 255, 255, .7)'
        }}>
          <div className="border-bottom mb-1">Items: <strong>{lyrList.length}</strong></div>
          {lyrList.map((l, i) => {
            const key = l && l.id ? l.id : i
            return <React.Fragment key={key}>{elTemplate(l)}</React.Fragment>
          })}
        </div>
      </div>
    </div>
  )
}

ListVisibleFeatures.propTypes = {
  /**
   * Function to render each feature in the list. Receives the feature as argument.
   * Required
   */
  elTemplate: PropTypes.func,
}

export { ListVisibleFeatures }
