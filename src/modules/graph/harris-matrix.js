import React, { useRef, useEffect, useState } from "react"
import { graphviz } from "d3-graphviz"
import PropTypes from "prop-types"

/**
 * HarrisMatrix component renders a graph using d3-graphviz.
 * 
 * @param {string} width - The width of the graph container.
 * @param {string} height - The height of the graph container.
 * @param {string} dot - The DOT string representing the graph.
 * @param {Array} data - The array of edges representing the graph.
 * @param {string} containerClassNames - Additional class names for the container.
 */
const HarrisMatrix = ({
  width = "100%",
  height = "400px",
  dot = null,
  data = [],
  containerClassNames = null,
}) => {
  const graphRef = useRef(null) // Reference to the graph container element
  const [error, setError] = useState(null) // State to handle errors

  useEffect(() => {
    // Validate if either data or dot is provided
    if (data.length === 0 && !dot) {
      setError("Either `data` or `dot` params are required to show a graph")
      return
    }
    let graphDot = dot // Create a new variable for the dot string
    if (data.length > 0) {
      // Convert data array to DOT format
      graphDot = `digraph G { ${data.map(r => `${r[0]} -> ${r[1]}; `).join(" ")}}`
    }

    // Render the graph using d3-graphviz
    if (graphRef.current) {
      try {
        graphviz(graphRef.current, {
          fit: true,
          width: width,
          height: height,
        }).renderDot(graphDot)  
      } catch (error) {
        setError("Failed to render the graph")
      }
    }
  }, [data, dot, width, height])

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

// PropTypes validation for the component props
HarrisMatrix.propTypes = {
  /**
   * The width of the graph container. Optional, default: "100%".
   */
  width: PropTypes.string,
  /**
   * The height of the graph container. Optional, default: "400px".
   */
  height: PropTypes.string,
  /**
   * The DOT string representing the graph. Optional, default: null.
   */
  dot: PropTypes.string,
  /**
   * The array of edges representing the graph. Optional, default: [].
   */
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /**
   * Additional class names for the container. Optional, default: null.
   */
  containerClassNames: PropTypes.string,
}

export default HarrisMatrix
