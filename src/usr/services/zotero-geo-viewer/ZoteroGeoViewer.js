import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"

import ZoteroRecordsPreview from "./ZoteroRecordsPreview"
import TagAutocomplete from "./TagAutocomplete"
import ZotMap from "./ZotMap"

// Helper to strip two outermost divs from a HTML string
const TAGCOORDINATES_URL = "/data/zoteroTagCoordinates.geojson"

// Module-level cache
let zoteroCache = null

const ZoteroGeoViewer = ({ 
  groupId, 
  showMap = true, 
  layout = 'vertical' // Can be 'vertical' or grid dimensions like '6x6', '8x4'
}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [mapped, setMapped] = useState(null)
  // Per-instance id for namespacing globals when multiple viewers are on same page
  const [instanceId] = useState(() => Math.floor(Math.random() * 1e9))
  const handlerName = `__zotSelectTag_${instanceId}`
  const [tagCoordinates, setTagCoordinates] = useState(null)
  const [missingTags, setMissingTags] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  // New state for currently selected tag and Zotero records by tag
  const [selectedTag, setSelectedTag] = useState(null)

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
      if (tagCoordinates) return tagCoordinates
      const resp = await fetch(TAGCOORDINATES_URL)
      if (!resp.ok) throw new Error("Failed to load zoteroTagCoordinates.geojson")
      const json = await resp.json()
      setTagCoordinates(json)
      return json
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
        const ontologyTagSet = new Set()
        const mappedFeatures = onto.features.map(f => {
          const name = f.properties.name
          // Gather candidate terms: name + exploded altLabel terms
          let candidates = [name]
          const altLabel = f.properties.altLabel
          if (altLabel) {
            // Split only by commas and trim each entry
            const splitCandidates = altLabel
              .split(",")
              .map(t => t.trim())
              .filter(Boolean)
            candidates = candidates.concat(splitCandidates)
          }
          // Make a set to avoid duplicates
          const candidateSet = new Set(candidates)
          // Add all @candidates to ontologyTagSet
          for (const term of candidateSet) {
            ontologyTagSet.add("@" + term)
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
              zoteroCount,
            },
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
  }, [groupId, tagCoordinates])

  // Log missingTags whenever it changes
  React.useEffect(() => {
    if (missingTags && missingTags.length > 0) {
      console.log("missingTags:", missingTags)
    }
  }, [missingTags])

  // Expose a per-instance global handler for popup buttons to select a tag
  useEffect(() => {
    const name = handlerName
    window[name] = (tag, altLabels) => {
      try {
        if (typeof tag === 'string' && tag.length) {
          setSearchTerm(tag)
          // Include both the main tag and alt labels in the selected tag data
          setSelectedTag({
            main: tag,
            alternatives: altLabels ? altLabels.split(',').map(s => s.trim()).filter(Boolean) : []
          })
        }
      } catch (e) {}
    }
    return () => {
      try { delete window[name] } catch (e) {}
    }
  }, [handlerName])

  if (error) return <div>Error: {error}</div>
  if (!data || !mapped) return <div>Loading...</div>

  // Features with geometry
  const featuresWithGeometry = mapped ? mapped.filter(f => f.geometry) : []

  // Tags array for autocomplete (objects with label and alts derived from altLabel)
  const tags = Array.isArray(mapped)
    ? (() => {
        const byLabel = new Map()
        for (const f of mapped) {
          const name = f?.properties?.name
          if (!name || typeof name !== "string") continue
          const key = name.toLowerCase()
          let entry = byLabel.get(key)
          if (!entry) {
            entry = { label: name, alts: [] }
            byLabel.set(key, entry)
          }
          const altLabel = f?.properties?.altLabel
          if (typeof altLabel === "string" && altLabel.trim()) {
            const phrases = altLabel
              .split(",")
              .map(s => s.trim())
              .filter(Boolean)
            const all = new Set([ ...entry.alts, ...phrases ])
            entry.alts = Array.from(all)
          }
        }
        return Array.from(byLabel.values()).sort((a,b)=>a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
      })()
    : []

  // GeoJSON for map
  const geojson = {
    type: "FeatureCollection",
    features: featuresWithGeometry,
  }

  
  // Parse layout configuration
  const isHorizontal = layout !== 'vertical';
  let leftCol = 6;
  let rightCol = 6;
  
  if (isHorizontal && layout.includes('x')) {
    const [left, right] = layout.split('x').map(Number);
    if (left && right && left + right === 12) {
      leftCol = left;
      rightCol = right;
    }
  }

  const searchAndResults = (
    <div className={isHorizontal ? '' : 'mt-3'}>
      <TagAutocomplete
        tags={tags}
        value={searchTerm}
        onChange={setSearchTerm}
        onSelect={(tag) => { setSelectedTag(tag); setSearchTerm(tag); }}
        selectedTag={selectedTag}
      />
      {selectedTag && (
        <ZoteroRecordsPreview groupId={groupId} tag={selectedTag} />
      )}
    </div>
  );

  if (!isHorizontal) {
    return (
      <Container fluid>
  {showMap && <ZotMap geojson={geojson} instanceId={instanceId} handlerName={handlerName} />}
        {searchAndResults}
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={leftCol}>
          {showMap && <ZotMap geojson={geojson} instanceId={instanceId} handlerName={handlerName} />}
        </Col>
        <Col md={rightCol}>
          {searchAndResults}
        </Col>
      </Row>
    </Container>
  )
}
export { ZoteroGeoViewer }
