import React from "react"
import jsxToString from "react-element-to-jsx-string"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'


const Documenter = ({ children }) => {
  const componentCode = jsxToString(children)

  return (
    <div className="row">
      <div className="col-sm-4">
        <SyntaxHighlighter language="jsx" style={okaidia}>
          {componentCode}
          </SyntaxHighlighter>
      </div>
      <div className="col-sm-8">{children}</div>
    </div>
  )
}

export {Documenter}
