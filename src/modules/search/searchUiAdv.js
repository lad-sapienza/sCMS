import React, { useState } from "react"
import PropTypes from "prop-types"
import { Button, Form, Row, Col, Spinner } from "react-bootstrap"
import { DashCircle, PlusCircle, Search } from "react-bootstrap-icons"
import { defaultOperatorsProptypes } from "./defaultOperators"

const SearchUiAdv = ({ fieldList, processData, operators, connectors, isLoading }) => {
  const [filters, setFilters] = useState([{ field: "", operator: "", value: "" }])

  const addFilter = () => {
    setFilters([...filters, { field: "", operator: "", value: "" }])
  }

  const removeFilter = index => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const newFilters = filters.map((filter, i) => (i === index ? { ...filter, [name]: value } : filter))
    setFilters(newFilters)
  }

  const handleSubmit = event => {
    event.preventDefault()
    processData(connectors, filters)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {filters.map((filter, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Form.Control
              as="select"
              name="field"
              value={filter.field}
              onChange={event => handleChange(index, event)}
              required
            >
              <option value="">Select Field</option>
              {fieldList.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col>
            <Form.Control
              as="select"
              name="operator"
              value={filter.operator}
              onChange={event => handleChange(index, event)}
              required
            >
              <option value="">Select Operator</option>
              {operators.map(operator => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col>
            <Form.Control
              type="text"
              name="value"
              value={filter.value}
              onChange={event => handleChange(index, event)}
              required
            />
          </Col>
          <Col xs="auto">
            <Button variant="danger" onClick={() => removeFilter(index)}>
              <DashCircle />
            </Button>
          </Col>
        </Row>
      ))}
      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={addFilter}>
            <PlusCircle /> Add Filter
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : <Search />} Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

SearchUiAdv.propTypes = {
  fieldList: PropTypes.array.isRequired,
  processData: PropTypes.func.isRequired,
  operators: defaultOperatorsProptypes.isRequired,
  connectors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
}

export default SearchUiAdv
