import PropTypes from 'prop-types'

const uiFilterPropTypes = {
  conn: PropTypes.oneOf(['_and', '_or']).isRequired,
  plain: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      operator: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
}

export default uiFilterPropTypes