import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Navbar from "./navbar"
import Slide from "./slide"
import Footer from "./footer"
// import Header from "./header"
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
        {/* @eiacopini: Slide in home e Header nelle interne */}
        {/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
