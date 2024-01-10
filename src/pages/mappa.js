import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Mappa = () => (
  <Layout>
    <MapContainer
      style={{ height: "400px" }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </Layout>
)

export const Head = () => <Seo title="Mappa" />

export default Mappa
