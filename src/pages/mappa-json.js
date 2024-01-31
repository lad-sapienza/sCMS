import * as React from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
// aggiungere a import react-leaft Marker, Popup,
//import L, { divIcon } from "leaflet"

import Layout from "../components/layout"
import Seo from "../components/seo"
import datiMappa from "../dati/toponimi.json"

// const setIcon = ({ properties }, latlng) => {
//   return L.marker(latlng, { icon: customMarkerIcon(properties.nome) })
// }
// const customMarkerIcon = nome =>
//   divIcon({
//     html: nome,
//     className: "icon",
//   })

//pointToLayer={setIcon}

function onEachFeature(feature, layer) {
  let popupContent =
    // @eiacopini: invece di mettere `nome`, forse ofireri una impostazione per specificare i campi che si voglioni in popup
    "<pre>" + JSON.stringify(feature.properties.nome, null, " ") + "</pre>"
  layer.bindPopup(popupContent)
}

const Mappa = () => (
  <Layout>
    <MapContainer
      style={{ height: "800px" }}
      // @eiacopini: il centro e zoom può esere calcolato dai dati, forse
      center={[41.90224270877692, 12.473489727658315]}
      zoom={9}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={datiMappa} onEachFeature={onEachFeature} />
      {/* <Marker position={[41.78543, 12.38431]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
    </MapContainer>
  </Layout>
)

export const Head = () => <Seo title="Mappa" />

export default Mappa
