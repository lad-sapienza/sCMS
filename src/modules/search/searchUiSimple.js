import React, { useState } from "react"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { Filter, Search } from "react-bootstrap-icons"

const SearchUiSimple = ({ fieldList, processData, isLoading, toggleSearchType }) => {
  const [searchText, setSearchText] = useState("")

  const handleChange = event => {
    let { value } = event.target
    setSearchText(value)
  }

  const preProcessData = searchText => {
    const filters = []
    Object.entries(fieldList).forEach(([k, v]) => {
      filters.push({
        field: k,
        operator: "_icontains",
        value: searchText,
      })
    })
    processData("_or", filters)
  }

  const handleSubmit = event => {
    event.preventDefault()
    preProcessData(searchText)
  }

  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="search"
              value={searchText}
              onChange={handleChange}
              placeholder="Enter search text"
              required
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="success" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : <Search />} Search
            </Button>
          </Col>
          <Col xs={1}>
            <Button onClick={toggleSearchType} variant="warning"><Filter /></Button>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  )
}

export default SearchUiSimple
