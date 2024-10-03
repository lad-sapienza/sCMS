import React, { useState } from "react"
import { Row, Col } from "react-bootstrap"

import SearchUI from "./searchUI.js"

import { plain2directus } from "./transformers"
import { plain2maplibre } from "./transformers"

const SearchUiTest = ({ type, fieldList, operators, connector }) => {
  type = ["simple", "advanced"].includes(type) ? type : "simple"


  const [outDir, setOutDir] = useState("")
  const [outML, setOutML] = useState("")
  const [outRaw, setOutRaw] = useState("")

  const processData = (conn, inputs) => {
    setOutDir(JSON.stringify(plain2directus(conn, inputs), null, 2))
    setOutML(JSON.stringify(plain2maplibre(conn, inputs), null, 2))
    setOutRaw(JSON.stringify({ conn: conn, filters: inputs }, null, 2))
  }

  return (
    <React.Fragment>
      <SearchUI fieldList={fieldList} operators={operators} connector={connector} processData={processData} />
      
      <hr />

      <Row className="row border m-3 shadow p-3">
        <Col>
          <p className="border mb-3 shadow p-2">Raw output</p>
          <pre>
            <code language="js">{outRaw}</code>
          </pre>
        </Col>
        <Col>
          <p className="border mb-3 shadow p-2">
            Output ransformed to Directus API syntax:
          </p>
          <pre>
            <code language="js">{outDir}</code>
          </pre>
        </Col>
        <Col>
          <p className="border mb-3 shadow p-2">
            Output ransformed to MapLibre Expression syntax:
          </p>
          <pre>
            <code language="js">{outML}</code>
          </pre>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default SearchUiTest
