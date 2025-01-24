import PropTypes from "prop-types"

import directusSourceProptypes from "./directus/directusSourceProptypes"
import path2dataSourceProptypes from "./path2data/path2dataSourceProptypes"

const sourcePropTypes = PropTypes.shape({
  /**
   * Path to GeoJSON data: might be a local path or an URL.
   * Required if dEndPoint or dTable are not set
   */
  path2data: path2dataSourceProptypes,
  
  directus: directusSourceProptypes,

  customApi: PropTypes.shape({
    formatUrl: PropTypes.func.isRequired,
    parseResponse: PropTypes.func.isRequired,
  }),

  /**
   * Tranformation to apply to data
   */
  transType: PropTypes.oneOf(["text", "csv2json", "json", "geojson"]),
})

export default sourcePropTypes
