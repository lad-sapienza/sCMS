import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { MapLibre, VectorLayerLibre, Search} from "./scms"
import sourcePropTypes from '../services/sourcePropTypes'
import fieldsPropTypes from '../services/fieldsPropTypes'
import PropTypes from "prop-types"

const MapSearch = ({ mapProps, searchProps, vectorLayerProps }) => {
  const [filter, setFilter] = useState(null)

  const processData = async (filter) => {
    setFilter(filter)
  }


  return (
    <div>
      <Row>
        <Col md={4}>
          <Search {...searchProps} onSearchRun={processData} />
        </Col>
        <Col md={8}>
          <MapLibre {...mapProps}>
          <VectorLayerLibre {...vectorLayerProps} filter={filter} /> )
          </MapLibre>
        </Col>
      </Row>
    </div>
  )
}

MapSearch.propTypes = {
  mapProps: PropTypes.object.isRequired,
  searchProps: PropTypes.shape({
    source: sourcePropTypes.isRequired,
    resultItemTemplate: PropTypes.func.isRequired,
    fieldList: fieldsPropTypes,
    operators: PropTypes.array,
    connector: PropTypes.object,
  }).isRequired,
  vectorLayerProps: PropTypes.shape({
    source: sourcePropTypes.isRequired,
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    searchInFields: fieldsPropTypes,
    fitToContent: PropTypes.bool,
    checked: PropTypes.bool,
    popupTemplate: PropTypes.string,
  }).isRequired,
}

export default MapSearch