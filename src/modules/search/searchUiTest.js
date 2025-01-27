import React, { useState } from "react"
import { Row, Col, Card } from "react-bootstrap"

import SearchUI from "./searchUI.js"

import DirectusService from "../../services/directus/directus.js"
import EdrService from "../../usr/services/edr/edr.js"
import plain2maplibre from "../../services/transformers/plain2maplibre.js"

const SearchUiTest = ({ fieldList, operators, connector, source }) => {
  

  const [output, setOutput] = useState({})

  const processData = (conn, inputs) => {
  
    const format = obj => JSON.stringify(obj, null, 2);

    const out = {
      directus: format(DirectusService.formatUrl(source.directus, {conn: conn, inputs: inputs})),
      edr: format(EdrService.formatUrl({conn, inputs})),
      maplibre: format(plain2maplibre(conn, inputs)),
      raw: format({ conn: conn, filters: inputs }),
    }

    setOutput(out)
  }

  return (
    <React.Fragment>
      <SearchUI
        fieldList={fieldList}
        operators={operators}
        connector={connector}
        processData={processData}
      />

      <hr />
      <Row className="my-5">
      {
        ['raw', 'directus', 'edr', 'maplibre'].map((i, key) => {
          return <Col xs={3} key={key}>
          <Card>
            <Card.Body>
              <Card.Title>{`Output ${i.toUpperCase()}`}</Card.Title>
              <pre language="js">
                <code language="js">{output[i]}</code>
              </pre>
            </Card.Body>
            </Card>
          </Col>
        })
      }
      </Row>
    </React.Fragment>
  )
}

export default SearchUiTest
