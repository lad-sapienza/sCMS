import React from "react"
import { Source, Layer } from "react-map-gl//maplibre"
import PropTypes from "prop-types"

const RasterLayerLibre = ({name, url, checked, attribution}) => {
  return <Source type="raster" tiles={Array.isArray(url) ? url : [url]}>
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
      attribution = {attribution ?  attribution : null}
    />
  </Source>
}

RasterLayerLibre.propTypes = {
  /**
   * Name of the layer to be shown in Control Panel
   */
  name: PropTypes.string,
  /**
   * String with URL of tiles or array with multiple URLs
   */
  url: PropTypes.oneOf([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]),
  /**
   * Boolean: if true, the layer will be turned on
   */
  checked: PropTypes.bool,
  /**
   * Attribution or credids for the layer
   */
  attribution: PropTypes.string,
}
export { RasterLayerLibre }
