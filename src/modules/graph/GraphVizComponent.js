import React, { useRef, useEffect, useState } from "react"
import Viz from "viz.js"
import { Module, render } from "viz.js/full.render.js"
import PropTypes from "prop-types"

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
        }
      })
      .catch(error => {
        setError("Failed to render the graph")
      })
  }, [dot])

  return (
    <div
      ref={graphRef}
      style={{ width, height }}
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
