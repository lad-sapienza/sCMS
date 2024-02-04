import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Container } from "react-bootstrap"
import { MDXProvider } from "@mdx-js/react"
import Seo from "../components/seo"

const shortcodes = {} // Provide common components here

export default function PageTemplate({ data, children }) {
  return (
    <Layout>
      <Container>
        <MDXProvider components={shortcodes}>{children}</MDXProvider>
      </Container>
    </Layout>
  )
}

export const Head = ({ data }) => (
  <Seo
    title={data.mdx.frontmatter.title}
    description={data.mdx.frontmatter.description}
  />
)

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
