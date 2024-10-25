import React from "react"
import { Source, Layer } from "react-map-gl//maplibre"
import PropTypes from "prop-types"

const RasterLayerLibre = ({name, tiles, checked}) => {
  return <Source type="raster" tiles={tiles}>
    <Layer
      type="raster"
      minzoom={0}
      maxzoom={22}
      layout={{
        visibility: checked === true ? 'visible' : 'none',
      }}
      metadata={{
        label: name
      }}
    />
  </Source>
}

RasterLayerLibre.propTypes = {
  /**
   * Name of the layer to be shown in Control Panel
   */
  name: PropTypes.string,
  /**
   * Array with URLs of tiles
   */
  tiles: PropTypes.arrayOf(PropTypes.string),
  /**
   * Boolean: if true, the layer will be turned on
   */
  checked: PropTypes.bool,
}
export { RasterLayerLibre }
