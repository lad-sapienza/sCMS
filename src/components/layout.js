import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Navbar from "./navbar"
import Slide from "./slide"
import FooterPage from "./footer"
import "./layout.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <div className="container-fluid p-0">
        <Navbar siteTitle={data.site.siteMetadata?.title || `Title`} />
        <Slide />
        <main>{children}</main>
        <FooterPage />
      </div>
    </>
  )
}

export default Layout
