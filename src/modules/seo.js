import PropTypes from "prop-types"
import { graphql } from "gatsby"

function makeAbsoluteUrl(siteUrl, value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  // ensure single slash between siteUrl and value
  if (siteUrl.endsWith("/") && value.startsWith("/")) {
    return siteUrl + value.slice(1)
  }
  if (!siteUrl.endsWith("/") && !value.startsWith("/")) {
    return siteUrl + "/" + value
  }
  return siteUrl + value
}

// Helper function to build SEO data (used by Head components)
export function buildSeoData({
  title,
  description,
  image,
  pathname,
  url,
  author,
  isArticle = false,
  datePublished,
  dateModified,
  tags = [],
  siteMetadata,
}) {
  const meta = siteMetadata || {}
  const siteUrl = meta.siteUrl || ""

  const fullUrl =
    url || (pathname ? makeAbsoluteUrl(siteUrl, pathname) : siteUrl)
  const resolvedImage = makeAbsoluteUrl(siteUrl, image || meta.defaultImage)
  const resolvedDescription = (
    description ||
    meta.defaultDescription ||
    ""
  ).trim()
  const resolvedTitle = (title || meta.title || "").trim()
  const pageTitle = meta.titleTemplate
    ? meta.titleTemplate.replace("%s", resolvedTitle)
    : resolvedTitle

  const twitterHandle = meta.twitter || ""

  const metaTags = [
    { name: "description", content: resolvedDescription },
    { property: "og:title", content: resolvedTitle },
    { property: "og:description", content: resolvedDescription },
    { property: "og:type", content: isArticle ? "article" : "website" },
    { property: "og:url", content: fullUrl },
    { property: "og:site_name", content: meta.siteName || meta.title },
  ]

  if (resolvedImage) {
    metaTags.push({ property: "og:image", content: resolvedImage })
    metaTags.push({ name: "twitter:card", content: "summary_large_image" })
    metaTags.push({ name: "twitter:image", content: resolvedImage })
  } else {
    metaTags.push({ name: "twitter:card", content: "summary" })
  }

  if (twitterHandle) {
    metaTags.push({ name: "twitter:site", content: twitterHandle })
    metaTags.push({ name: "twitter:creator", content: twitterHandle })
  }

  // Article JSON-LD
  let articleJsonLd = null
  if (isArticle) {
    const authors = author ? [author] : meta.author ? [meta.author] : []
    articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": fullUrl,
      },
      headline: resolvedTitle,
      description: resolvedDescription,
      image: resolvedImage ? [resolvedImage] : [],
      author: authors.map(a => ({ "@type": "Person", name: a })),
      publisher: {
        "@type": "Organization",
        name: meta.siteName || meta.title,
        logo: {
          "@type": "ImageObject",
          url: makeAbsoluteUrl(siteUrl, meta.defaultImage),
        },
      },
      datePublished: datePublished || null,
      dateModified: dateModified || null,
      keywords: tags && tags.length ? tags.join(", ") : undefined,
    }
  }

  return {
    pageTitle,
    fullUrl,
    metaTags,
    articleJsonLd,
  }
}

// Legacy component for backward compatibility (if needed)
// This is kept for any existing usages but should be replaced with Head exports
const Seo = ({
  title,
  description,
  image,
  imageAlt,
  pathname,
  url,
  author,
  isArticle = false,
  datePublished,
  dateModified,
  tags = [],
}) => {
  console.warn(
    "The Seo component is deprecated. Please use the Head export with buildSeoData helper instead."
  )
  return null
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  pathname: PropTypes.string,
  url: PropTypes.string,
  author: PropTypes.string,
  isArticle: PropTypes.bool,
  datePublished: PropTypes.string,
  dateModified: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
}

export default Seo

// GraphQL fragment for SEO site metadata (use in page queries)
export const seoSiteMetadataFragment = graphql`
  fragment SeoSiteMetadata on Site {
    siteMetadata {
      title
      titleTemplate
      siteUrl
      defaultDescription
      defaultImage
      twitter
      siteName
      author
    }
  }
`
