import PropTypes from "prop-types"

const directusSourceProptypes = PropTypes.shape({
  /**
   * Directus endpoint.
   */
  endPoint: PropTypes.string,
  
  /**
   * Directus table name, to be used if env variable GATSBY_DIRECTUS_ENDPOINT is set.
   * Required if neither path2data or dEndPoit are set
   */
  table: PropTypes.string,
  
  /**
   * Directus optional filters and other, provided as querystring compatible to Directus API
   */
  queryString: PropTypes.string,
  
  /**
   * Directus access token.
   * Required if env variable GATSBY_DIRECTUS_TOKEN is not set
   */
  token: PropTypes.string,
  
  /**
   * Id of a specific record to retrieve
   */
  id: PropTypes.number,

  /**
   * Field that contains geographical data to display on map
   */
  geoField:PropTypes.string,
})


export default directusSourceProptypes;