import * as React from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

import Layout from "../components/layout"
import Seo from "../components/seo"
import datiMappa from "../dati/toponimi.json"

function onEachFeature(feature, layer) {
  let popupContent =
    "<pre>" + JSON.stringify(feature.properties.nome, null, " ") + "</pre>"
  layer.bindPopup(popupContent)
}

const MappaDirectus = () => (
  <Layout>
    <MapContainer
      style={{ height: "400px" }}
      center={[41.78543, 12.38431]}
      zoom={10}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={datiMappa} onEachFeature={onEachFeature} />
    </MapContainer>
  </Layout>
)

export const Head = () => <Seo title="Mappa Directus" />

export default MappaDirectus
