import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Container } from "react-bootstrap"
import { MDXProvider } from "@mdx-js/react"
//import { Mappa } from "../components/maps"

const shortcodes = {} // Provide common components here

export default function PageTemplate({ data, children }) {
  return (
    <Layout>
      <Container>
        <h1>{data.mdx.frontmatter.title}</h1>
        <div>{data.mdx.frontmatter.description}</div>
        <MDXProvider components={shortcodes}>{children}</MDXProvider>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        description
      }
    }
  }
`
