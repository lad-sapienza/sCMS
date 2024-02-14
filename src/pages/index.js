import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  const { mdx } = data

  return (
    <Layout>
      <div>
        <h1>{mdx.frontmatter.title}</h1>
        {/* Render other content from mdx file */}
        <div dangerouslySetInnerHTML={{ __html: mdx.body }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    mdx(frontmatter: { slug: { eq: "home" } }) {
      frontmatter {
        title
      }
      body
    }
  }
`

export default IndexPage
