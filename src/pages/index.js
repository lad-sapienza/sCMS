import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../modules/seo"

const IndexPage = ({ data }) => {
  const { mdx } = data

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} />
      <div>
        <h1>{mdx.frontmatter.title}</h1>
        <MdxContent content={mdx.body} />
      </div>
    </Layout>
  )
}

const MdxContent = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
)

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
