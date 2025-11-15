import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../usr/layout/layout"
import { buildSeoData } from "../modules/seo"

const NotFoundPage = () => (
  <Layout>
    <h1>Oh! We are sorry...</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export function Head({ data }) {
  const seoData = buildSeoData({
    title: "404: Not Found",
    description: "The page you are looking for does not exist.",
    siteMetadata: data.site.siteMetadata,
  })

  return (
    <>
      <title>{seoData.pageTitle}</title>
      {seoData.metaTags.map((m, i) => {
        if (m.name) return <meta key={i} name={m.name} content={m.content} />
        return <meta key={i} property={m.property} content={m.content} />
      })}
    </>
  )
}

export const query = graphql`
  query {
    site {
      ...SeoSiteMetadata
    }
  }
`

export default NotFoundPage
