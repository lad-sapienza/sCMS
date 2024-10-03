import React, { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"

const SearchUiSimple = ({fieldList, processData}) => {
  const [searchText, setSearchText] = useState()
  const handleChange = event => {
    let { value } = event.target
    setSearchText(value)
  }

  const preProcessData = searchText => {
    const filters = [];
    Object.entries(fieldList).forEach(([k, v]) => {
      filters.push({
        "field": k,
        "operator": "_icontains",
        "value": searchText
      })
    })
    processData('_or', filters)
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Form.Control
            type="search"
            onChange={e => handleChange(e)}
          />
        </Col>
        <Col>
          <Button variant="success"
            onClick={e => {
              preProcessData(searchText)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default SearchUiSimple
