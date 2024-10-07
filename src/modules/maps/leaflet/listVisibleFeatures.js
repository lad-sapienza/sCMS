import React, { useState } from "react"
import { useMapEvent } from "react-leaflet/hooks"
import L from "leaflet"

const getFeaturesInView = map => {
  var features = []
  map.eachLayer(function (lyr) {
    if (lyr instanceof L.Marker) {
      if (map.getBounds().contains(lyr.getLatLng())) {
        features.push(lyr.feature)
      }
    }
  })
  return features
}

const ListVisibleFeatures = ({ elTemplate }) => {
  const [lyrList, setLyrList] = useState([])

  const map = useMapEvent("moveend", () => {
    setLyrList(getFeaturesInView(map))
    // console.log('map center:', map.getCenter())
  })

  if (lyrList.length === 0) {
    return <></>
  } else {
    console.log(lyrList.length)

    return (
      <div
        style={{
          position: "absolute",
          maxHeight: "50%",
          width: "20%",
          bottom: "0",
          left: "0px",
          border: "1px solid red",
          padding: ".5rem",
          zIndex: 999,
          overflow: "auto",
          background: "rgba(255, 255, 255, .5)",
        }}
      >
        Items: <strong>{lyrList.length}</strong>{" "}
        <div className="list-container">
          {lyrList.map(l => {
            return <>{elTemplate(l)}</>
          })}
        </div>
      </div>
    )
  }
}

export { ListVisibleFeatures }
