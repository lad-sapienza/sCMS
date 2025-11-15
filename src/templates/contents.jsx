import React from "react"
import { graphql } from "gatsby"
import Layout from "../usr/layout/layout"
import { MDXProvider } from "@mdx-js/react"
import { buildSeoData } from "../modules/seo"

export default function PageTemplate({ data, children }) {
  const template = data.mdx.frontmatter.template
  
  return (
    <Layout data={data} template={template}>
      <MDXProvider>{children}</MDXProvider>
    </Layout>
  )
}

export function Head({ data, location }) {
  const { mdx, site } = data
  const { frontmatter } = mdx
  
  const seoData = buildSeoData({
    title: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.img?.childImageSharp?.gatsbyImageData?.images?.fallback?.src,
    pathname: location.pathname,
    author: frontmatter.author,
    isArticle: frontmatter.template === "article",
    datePublished: frontmatter.dateISO,
    dateModified: frontmatter.dateISO,
    tags: frontmatter.tags,
    siteMetadata: site.siteMetadata,
  })

  return (
    <>
      <title>{seoData.pageTitle}</title>
      <link rel="canonical" href={seoData.fullUrl} />
      {seoData.metaTags.map((m, i) => {
        if (m.name) return <meta key={i} name={m.name} content={m.content} />
        return <meta key={i} property={m.property} content={m.content} />
      })}
      {seoData.articleJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.articleJsonLd)}
        </script>
      )}
    </>
  )
}

export const query = graphql`
  query ($id: String!) {
    site {
      ...SeoSiteMetadata
    }
    mdx(id: { eq: $id }) {
      tableOfContents
      frontmatter {
        title
        description
        slug
        author
        tags
        template
        date(formatString: "DD MMMM YYYY", locale: "it-IT")
        dateISO: date
        img {
          base
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              layout: CONSTRAINED
              quality: 100
              formats: [AUTO, AVIF, WEBP]
            )
          }
        }
      }
    }
  }
`
