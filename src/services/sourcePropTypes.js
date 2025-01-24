import PropTypes from 'prop-types'
import directusSourceProptypes from "./directus/directusSourceProptypes"
import path2dataSourceProptypes from "./path2data/path2dataSourceProptypes"

// Define the shape of the sourcePropTypes object
const sourcePropTypes = PropTypes.shape({
  // PropTypes for path2data source
  path2data: path2dataSourceProptypes,
  
  // PropTypes for directus source
  directus: directusSourceProptypes,

  // PropTypes for custom API source
  customApi: PropTypes.shape({
    // Function to format the URL
    formatUrl: PropTypes.func.isRequired,
    // Function to parse the response
    parseResponse: PropTypes.func.isRequired,
  })
})

export default sourcePropTypes
