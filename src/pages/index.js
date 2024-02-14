import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../modules/seo"
const IndexPage = ({ data }) => {
  const { mdx } = data

  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: mdx.body }} />
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

export const Head = () => <Seo title="Benvenuti"/>
