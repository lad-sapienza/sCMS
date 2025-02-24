import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { MapLibre, VectorLayerLibre, Search} from "./scms"
import sourcePropTypes from '../services/sourcePropTypes'
import fieldsPropTypes from '../services/fieldsPropTypes'
import PropTypes from "prop-types"

import DirectusService from '../services/directus/directus'

const MapSearch = ({ mapProps, searchProps, vectorLayerProps }) => {
  const [stateVectorLayerProps, setStateVectorLayerProps] = useState(null)

  const processData = async (source, filter) => {

    try {
      const qs = `filter=${JSON.stringify(DirectusService.form2querystring(filter.conn, filter.inputs))}`
      const vectorLayerPropsCopy = structuredClone(vectorLayerProps);
      vectorLayerPropsCopy.source.directus.queryString = qs

      console.log('vectorLayerPropsCopy', vectorLayerPropsCopy)
      setStateVectorLayerProps(vectorLayerPropsCopy)
    } catch (err) {
      console.error('Error in querying remote data', err)
    }
  }

  console.log(stateVectorLayerProps)

  return (
    <div>
      <Row>
        <Col md={4}>
          <Search {...searchProps} onSearchRun={processData} />
        </Col>
        <Col md={8}>
          <MapLibre {...mapProps}>
          stateVectorLayerProps && <VectorLayerLibre {...stateVectorLayerProps} />
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
    refId: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    searchInFields: fieldsPropTypes,
    fitToContent: PropTypes.bool,
    checked: PropTypes.bool,
    popupTemplate: PropTypes.string,
  }).isRequired,
}

export default MapSearch