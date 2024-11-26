import React, { useState } from "react"
import { DashCircle, PlusCircle, Search } from "react-bootstrap-icons"

import { Row, Col, Form, Button } from "react-bootstrap"
import { defaultOperators } from "./defaultOperators"

const SearchUiAdv = ({ fieldList, processData, operators, connectors }) => {
  operators = Object.assign(defaultOperators, operators)
  connectors = {
    _and: connectors?._and || "AND",
    _or: connectors?._or || "OR",
  }

  const [inputs, setInputs] = useState([
    {
      /**
       * TODO
       * Attualmente fieldlist e un oggetto: chiave (stringa) e valore (stringa)
       * Questa funzione continua ad esserci, INOLTRE:
       * puo anche essere chiave (stringa) e valore (oggetto: label: "Label", values: ["Value1", "Value2"])
       * !!!!IMPORTANTE: fare poi anche un esemepio in map.md
       * !!!!IMPORTANTE (@jbog): Aggiornare la documentazione
       */
      field: Object.keys(fieldList)[0],
      operator: Object.keys(operators)[0],
      value: "",
    },
  ])

  const [conn, setConn] = useState("_and")

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        field: Object.keys(fieldList)[0],
        operator: Object.keys(operators)[0],
        value: "",
      },
    ])
  }

  const handleChange = (event, index) => {
    let { name, value } = event.target
    let onChangeValue = [...inputs]
    onChangeValue[index][name] = value
    setInputs(onChangeValue)
  }

  const handleDeleteInput = index => {
    const newArray = [...inputs]
    newArray.splice(index, 1)
    setInputs(newArray)
  }

  return (
    <React.Fragment>
      {inputs.length > 1 && (
        <React.Fragment>
          {Object.entries(connectors).map(([k, v], i) => (
            <Form.Check
              key={k}
              inline
              type="radio"
              name="connector"
              value={k}
              label={v}
              checked={k === conn}
              onChange={event => setConn(k)}
            />
          ))}
        </React.Fragment>
      )}
      {inputs.map((item, index) => (
        <Row key={index} className="my-2">
          <Col sm>
            <Form.Select
              aria-label="Select field"
              name="field"
              value={item.field}
              onChange={event => handleChange(event, index)}
            >
              {Object.entries(fieldList).map(([k, v], i) => (
                <option key={i} value={k}>
                  {/* Se v is string, così come'è, se oggetto: {v.label} */}
                  {v}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col sm>
            <Form.Select
              aria-label="Operator"
              name="operator"
              value={item.operator}
              onChange={event => handleChange(event, index)}
            >
              {Object.entries(operators).map(([k, v], i) => (
                <option value={k} key={i}>
                  {v}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col sm>
          {/* Map su fieldlist se oggetto e fai vedere Form.Select */}
            <Form.Control
              type="input"
              name="value"
              value={item.value}
              onChange={event => handleChange(event, index)}
            />
          </Col>
          <Col sm>
            {index > 0 && (
              <Button
                variant="danger"
                onClick={() => handleDeleteInput(index)}
                className="mx-1"
              >
                <DashCircle />
              </Button>
            )}
            {index === inputs.length - 1 && (
              <React.Fragment>
                <Button
                  variant="info"
                  className="mx-1"
                  onClick={() => handleAddInput()}
                >
                  <PlusCircle />
                </Button>
                <Button
                  onClick={() => processData(conn, inputs)}
                  variant="success"
                  className="mx-1"
                >
                  <Search />
                </Button>
              </React.Fragment>
            )}
          </Col>
        </Row>
      ))}
    </React.Fragment>
  )
}

export default SearchUiAdv
