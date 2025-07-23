import React from "react"
import PropTypes from "prop-types"
import { TileLayer, LayersControl } from "react-leaflet"

const RasterLayer = ({ name, url, checked = false, attribution = null, asOverlay = false }) => {
  const tileAttribution = attribution || null
  if (asOverlay) {
    return (
      <LayersControl.Overlay checked={checked} name={name}>
        <TileLayer url={url} attribution={tileAttribution} />
      </LayersControl.Overlay>
    )
  }
  return (
    <LayersControl.BaseLayer checked={checked} name={name}>
      <TileLayer url={url} attribution={tileAttribution} />
    </LayersControl.BaseLayer>
  )
}

RasterLayer.propTypes = {
  /**
   * Name of the layer to show in Layer control.
   * Required
   */
  name: PropTypes.string.isRequired,
  /**
   * URL where raster tiles are found.
   * Required
   */
  url: PropTypes.string.isRequired,
  /**
   * Property to control the layer's default visibility in the map and control panel.
   * Optional, default: false
   */
  checked: PropTypes.bool,
  /**
   * Attribution or credits for the layer.
   * Optional
   */
  attribution: PropTypes.string,
  /**
   * If true, the layer will be listed in the Overlay list; if false (default), in the base-layers list.
   * Optional, default: false
   */
  asOverlay: PropTypes.bool
}

export { RasterLayer }
