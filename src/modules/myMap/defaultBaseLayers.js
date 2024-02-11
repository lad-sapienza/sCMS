export const defaultBaseLayers = {
  OSM: {
    name: "Open Street Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  EsriSatellite: {
    name: "Esri Imagery/Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  EsriStreets: {
    name: "Esri Streets",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  },
  EsriTopo: {
    name: "Esri Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  },
  GoogleSatellite: {
    name: "Google Satellite",
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  },
  GoogleRoadmap: {
    name: "Google Roadmap",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  },
  GoogleTerrain: {
    name: "Google Terrain",
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  },
  GoogleAlteredRoadmap: {
    name: "Google Altered Roadmap",
    url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
  },
  GoogleTerrainOnly: {
    name: "Google Terrain Only",
    url: "https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}",
  },
  GoogleHybrid: {
    name: "Google Hybrid",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  },
  CartoDb: {
    name: "Carto DB",
    url: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  },
  StamenTerrain: {
    name: "Stamen Terrain",
    url: "http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png",
  },
  OSMMapnick: {
    name: "OpenStreetMap Mapnick",
    url: "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  OSMCycle: {
    name: "OSM Cycle Map",
    url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
  },
}
