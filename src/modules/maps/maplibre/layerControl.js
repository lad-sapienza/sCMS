import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { useMap } from "@vis.gl/react-maplibre"
import LayerControlPanel from "./layerControlPanel"

/**
 * SimpleControl component
 * Adds a custom control to the MapLibre map.
 *
 * @param {string} position - The position of the control on the map. Default is "top-right".
 */
const SimpleControl = ({ position = "top-right" }) => {
  // Get the current map instance using the useMap hook
  const { current: map } = useMap()

  useEffect(() => {
    // If the map instance is not available, return early
    if (!map) return

    // Create a container for the control
    const controlContainer = document.createElement("div")
    controlContainer.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")

    // Render the LayerControlPanel component inside the control container
    const root = ReactDOM.createRoot(controlContainer)
    root.render(
      <LayerControlPanel mapInstance={map} />,
    )

    // Define the control object with onAdd and onRemove methods
    const control = {
      onAdd: () => controlContainer,
      onRemove: () => {
        controlContainer.parentNode.removeChild(controlContainer)
      },
    }

    // Add the control to the map at the specified position
    map.addControl(control, position)

    // Cleanup function to remove the control when the component unmounts
    return () => {
      if (map && controlContainer.parentNode) {
        map.removeControl(control)
      }
    }
  }, [map, position])

  return null
}

export default SimpleControl
