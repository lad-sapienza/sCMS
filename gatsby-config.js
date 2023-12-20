require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Gatsby Directus UI`,
    description: `A gatsby site project with Directus`,
    author: `Julian Bogdani, Eleonora Iacopini`,
  },
  // proxy: {
  //   prefix: "/db/items/cms_articles",
  //   url: "https://inrome.sns.it",
  // },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          precision: 6,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-bootstrap-5`,
        short_name: `gb5-starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `standalone`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: "@directus/gatsby-source-directus",
      options: {
        url: process.env.GATSBY_DIRECTUS_URL, // Nuovo URL
        auth: {
          token: process.env.GATSBY_DIRECTUS_TOKEN, //token
        },
      },
    },
    `gatsby-plugin-gatsby-cloud`,
  ],
}
