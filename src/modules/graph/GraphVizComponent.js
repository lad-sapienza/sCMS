import React, { useRef, useEffect, useState } from "react"
import Viz from "viz.js"
import { Module, render } from "viz.js/full.render.js"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { ZoomIn, ZoomOut, Fullscreen } from "react-bootstrap-icons"
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

/**
 * GraphVizComponent renders a directed graph using viz.js from a DOT string.
 * 
 * @param {string} dot - The DOT string representing the graph.
 * @param {string} width - The width of the graph container.
 * @param {string} height - The height of the graph container.
 * @param {string} containerClassNames - Additional class names for the container.
 */
const GraphVizComponent = ({
  dot,
  width = "100%",
  height = "400px",
  containerClassNames = null,
}) => {
  const graphRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!dot) {
      setError("The `dot` param is required to show a graph")
      return
    }

    const viz = new Viz({ Module, render })

    viz.renderSVGElement(dot)
      .then(element => {
        if (graphRef.current) {
          graphRef.current.innerHTML = ""
          graphRef.current.appendChild(element)

          const svg = d3.select(element)
          svg.attr("width", "100%").attr("height", "100%").attr("preserveAspectRatio", "xMidYMid meet")

          const zoom = d3.zoom().on("zoom", (event) => {
            svg.attr("transform", event.transform)
          })

          svg.call(zoom)

          // Add zoom controls
          const controls = document.createElement("div")
          controls.style.display = "flex"
          controls.style.gap = "5px"
          controls.style.position = "absolute"
          controls.style.bottom = "1rem"
          controls.style.right = "1rem"
          controls.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
          controls.style.padding = "5px"
          controls.style.borderRadius = "5px"
          controls.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"

          const zoomInButton = document.createElement("button")
          zoomInButton.classList.add("btn", "btn-primary")
          zoomInButton.onclick = () => {
            svg.transition().duration(750).call(zoom.scaleBy, 1.2)
          }
          const rootZoomIn = createRoot(zoomInButton);
          flushSync(() => {
            rootZoomIn.render(<ZoomIn />);
          })

          const zoomOutButton = document.createElement("button")
          zoomOutButton.classList.add("btn", "btn-primary")
          zoomOutButton.onclick = () => {
            svg.transition().duration(750).call(zoom.scaleBy, 0.8)
          }
          const rootZoomOut = createRoot(zoomOutButton);
          flushSync(() => {
            rootZoomOut.render(<ZoomOut />);
          })
          

          const resetZoomButton = document.createElement("button")
          resetZoomButton.classList.add("btn", "btn-primary")
          resetZoomButton.onclick = () => {
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
          }
          const rootResetZoom = createRoot(resetZoomButton);
          flushSync(() => {
            rootResetZoom.render(<Fullscreen />);
          })
          

          controls.appendChild(zoomInButton)
          controls.appendChild(zoomOutButton)
          controls.appendChild(resetZoomButton)
          graphRef.current.appendChild(controls)
        }
      })
      .catch(error => {
        setError("Failed to render the graph")
      })
  }, [dot])

  return (
    <div
      ref={graphRef}
      style={{ width, height, overflow: "hidden", position: "relative" }} 
      className={containerClassNames}
    >
      {error && <p className="text-danger">{error}</p>}
    </div>
  )
}

GraphVizComponent.propTypes = {
  /**
   * The DOT string representing the graph. Required.
   */
  dot: PropTypes.string.isRequired,
  /**
   * The width of the graph container. Optional, default: "100%".
   */
  width: PropTypes.string,
  /**
   * The height of the graph container. Optional, default: "400px".
   */
  height: PropTypes.string,
  /**
   * Additional class names for the container. Optional, default: null.
   */
  containerClassNames: PropTypes.string,
}

export default GraphVizComponent
