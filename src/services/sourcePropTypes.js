import PropTypes from "prop-types"

import directusSourceProptypes from "./directus/directusSourceProptypes"

const sourcePropTypes = PropTypes.shape({
  /**
   * Path to GeoJSON data: might be a local path or an URL.
   * Required if dEndPoint or dTable are not set
   */
  path2data: PropTypes.string,
  
  directus: directusSourceProptypes,
  /**
   * Tranformation to apply to data
   */
  transType: PropTypes.oneOf(["text", "csv2json", "json", "geojson"]),
})

export default sourcePropTypes
