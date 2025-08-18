import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap/";
import { Form } from 'react-bootstrap';
import {
  MapLibre,
  RasterLayerLibre,
  VectorLayerLibre,
} from "../../../modules/scms"

const ONTOLOGIA_URL = "/data/ontologia.geojson";

// Module-level cache
let zoteroCache = null

const Zot = ({groupId}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [mapped, setMapped] = useState(null)
  const [ontologia, setOntologia] = useState(null)
  const [missingTags, setMissingTags] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchZoteroTagsFlattened() {
      const baseUrl = `https://api.zotero.org/groups/${groupId}/items/tags`
      const limit = 100
      let start = 0
      let total = Infinity
      const result = {}
      const headers = { Accept: "application/json" }
      while (start < total) {
        const url = `${baseUrl}?start=${start}&limit=${limit}`
        const resp = await fetch(url, { headers })
        if (!resp.ok) {
          throw new Error(`Zotero API error: ${resp.status} ${resp.statusText}`)
        }
        const items = await resp.json()
        const totalResults = resp.headers.get("Total-Results")
        if (totalResults == null) {
          throw new Error("Missing Total-Results header")
        }
        total = parseInt(totalResults, 10)
        for (const item of items) {
          if (item.tag?.startsWith("@")) {
            result[item.tag] = item.meta.numItems
          }
        }
        start += limit
      }
      return result
    }
    async function fetchOntology() {
      if (ontologia) return ontologia;
      const resp = await fetch(ONTOLOGIA_URL);
      if (!resp.ok) throw new Error("Failed to load ontologia.geojson");
      const json = await resp.json();
      setOntologia(json);
      return json;
    }

    let cancelled = false
    async function loadAll() {
      try {
        let zotData = zoteroCache
        if (!zotData) {
          zotData = await fetchZoteroTagsFlattened()
          zoteroCache = zotData
        }
        setData(zotData)
        const onto = await fetchOntology()
        // Collect all ontology tags (for presence test)
        const ontologyTagSet = new Set();
        const mappedFeatures = onto.features.map(f => {
          const name = f.properties.name
          // Gather candidate terms: name + exploded altLabel terms
          let candidates = [name]
          const altLabel = f.properties.altLabel
          if (altLabel) {
            // explode by commas, then by spaces, flatten, and filter empty
            const splitCandidates = altLabel
              .split(',')
              .flatMap(x => x.split(/\s+/))
              .map(t => t.trim())
              .filter(Boolean)
            candidates = candidates.concat(splitCandidates)
          }
          // Make a set to avoid duplicates
          const candidateSet = new Set(candidates)
          // Add all @candidates to ontologyTagSet
          for (const term of candidateSet) {
            ontologyTagSet.add("@" + term);
          }
          // Sum zotero counts for all @candidates
          let zoteroCount = 0
          for (const term of candidateSet) {
            const zotKey = "@" + term
            if (zotData[zotKey]) {
              zoteroCount += zotData[zotKey]
            }
          }
          // Ensure zoteroCount is inside properties for map styling and popups
          return {
            ...f,
            properties: {
              ...f.properties,
              zoteroCount
            }
          }
        })
        // Find all @ tags in zotero that are not in the ontology
        const zoteroTags = Object.keys(zotData)
        const missingTags = zoteroTags.filter(tag => !ontologyTagSet.has(tag))
        if (!cancelled) {
          setMapped(mappedFeatures)
          setMissingTags(missingTags)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }
    loadAll()
    return () => {
      cancelled = true
    }
  }, [groupId, ontologia])

  // Log missingTags whenever it changes
  React.useEffect(() => {
    if (missingTags) {
      console.log('missingTags:', missingTags);
    }
  }, [missingTags]);

  if (error) return <div>Error: {error}</div>
  if (!data || !mapped) return <div>Loading...</div>

  // Features with geometry
  const featuresWithGeometry = mapped ? mapped.filter(f => f.geometry) : [];

  // Filtered mapped items for button list (search is case-insensitive on name)
  const filteredMapped = Array.isArray(mapped)
    ? mapped
        .filter(f => {
          const name = (f.properties && f.properties.name ? f.properties.name : "").toLowerCase();
          return name.includes(searchTerm.trim().toLowerCase());
        })
        .sort((a, b) => {
          const an = (a.properties && a.properties.name ? a.properties.name.toLowerCase() : "");
          const bn = (b.properties && b.properties.name ? b.properties.name.toLowerCase() : "");
          if (an < bn) return -1;
          if (an > bn) return 1;
          return 0;
        })
    : [];

  // GeoJSON for map
  const geojson = {
    type: "FeatureCollection",
    features: featuresWithGeometry,
  };

  // Style expression for coloring features
  const fillColor = [
    "case",
    [">", ["get", "zoteroCount"], 0],
    "#43ff6480", // green if zoteroCount > 0
    "#ff4b6480", // red otherwise
  ]

  return (
    <div>
      <h3>Zotero Tags mapped to Ontologia</h3>
      <div style={{ height: "500px", marginBottom: "1em" }}>
        <MapLibre center="20.01,39.87,9" height="100%">
          <RasterLayerLibre
            name="Esri Imagery/Satellite"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            checked={true}
          />
          {/* TODO: VectorLayer should accept GeoJSON! */}
          <VectorLayerLibre
            name="Sites"
            checked={true}
            source={{
              geojson: geojson,
            }}
            style={{
              id: "Sites",
              type: "circle",
              paint: {
                // Radius varies by zoteroCount: 4 (none), 8 (low), 16 (mid), 24 (high)
                "circle-radius": [
                  "interpolate",
                  ["linear"], ["get", "zoteroCount"],
                  0, 4,
                  1, 8,
                  5, 16,
                  20, 24
                ],
                "circle-color": fillColor,
                "circle-stroke-width": 1.5,
                "circle-stroke-color": "#000000",
              },
            }}
            popupTemplate="<h4 onclick=alert('${name}')>${name}</h4><p>${altLabel}</p><p><b>Items:</b> ${zoteroCount}</p>"
          />
        </MapLibre>
      </div>
      {/* Filter/Search input and button list for mapped items */}
      <div style={{ margin: '1em 0' }}>
        <Form.Control
          type="search"
          placeholder="Search by tags..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em', marginTop: '0.5em' }}>
          {filteredMapped.length === 0 ? (
            <span style={{ color: '#888' }}>No matches</span>
          ) : (
            filteredMapped.map((f, i) => (
              <Button
                onClick={()=> {console.log(f.properties)}}
                variant="light"
                key={i}
              >
                {f.properties && f.properties.name}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
export { Zot }
