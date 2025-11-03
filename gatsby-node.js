const path = require("path")
const postTemplate = path.resolve(`./src/templates/contents.jsx`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MdxFrontmatter {
      img: File @fileByRelativePath
      template: String
      author: String
      tags: [String]
    }
    type SiteSiteMetadata {
      defaultDescription: String
    }
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            description
            slug
            title
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX result", result.errors)
  }

  // Create blog post pages.
  const posts = result.data.allMdx.nodes
  posts.forEach(node => {
    let pagePath

    const slug = node.frontmatter && node.frontmatter.slug

    if (slug) {
      // If explicit slug is provided, honor it (treat "home" as root)
      pagePath = slug === "home" ? "/" : slug
    } else {
      // Derive path from file system location under src/usr/contents
      const filePath = node.internal.contentFilePath
      let relativePath = path.relative(
        path.join(__dirname, "src/usr/contents"),
        filePath
      )

      // Normalize separators to URL-style forward slashes
      relativePath = relativePath.split(path.sep).join('/')

      // Remove trailing index.mdx, index.md, .mdx, or .md extension
      relativePath = relativePath
        .replace(/\/index\.mdx$/i, '')
        .replace(/\/index\.md$/i, '')
        .replace(/\.mdx$/i, '')
        .replace(/\.md$/i, '')

      // Ensure a leading slash and use '/' as root for empty
      pagePath = '/' + (relativePath === '' ? '' : relativePath)
      if (pagePath === '/home') pagePath = '/'
    }

    createPage({
      path: pagePath,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: { id: node.id },
    })
  })
}
