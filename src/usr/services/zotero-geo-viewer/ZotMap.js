import React from "react";
import {
  MapLibre,
  RasterLayerLibre,
  VectorLayerLibre,
} from "../../../modules/scms";

export default function ZotMap({ geojson, instanceId, handlerName }) {
  if (!geojson) return null;

  const ns = instanceId != null ? String(instanceId) : 'default'

  const fillColor = [
    "case",
    [">", ["get", "zoteroCount"], 0],
    "#43ff6480",
    "#ff4b6480",
  ];

  const popupTemplate = `<h4>\${name}</h4><p>\${altLabel}</p><button class='btn btn-info btn-sm' type='button' data-tag='\${name}' data-alt-labels='\${altLabel}' onclick='window["${handlerName}"] && window["${handlerName}"](this.dataset.tag, this.dataset.altLabels)'>Show \${zoteroCount} records</button>`;

  return (
    <div style={{ height: "500px", marginBottom: "1em" }}>
      <MapLibre height="100%">
        <RasterLayerLibre
          name="Esri Imagery/Satellite"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          checked={true}
        />
        <VectorLayerLibre
          name={`Sites-${ns}`}
          checked={true}
          source={{ geojson }}
          fitToContent={true}
          style={{
            id: `Sites-${ns}`,
            type: "circle",
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"], ["get", "zoteroCount"],
                0, 2,
                1, 4,
                5, 8,
                20, 16,
                50, 24,
                100, 32,
              ],
              "circle-color": fillColor,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#000000",
            },
          }}
          popupTemplate={popupTemplate}
        />
      </MapLibre>
    </div>
  );
}
