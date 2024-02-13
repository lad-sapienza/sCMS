import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { Container } from "react-bootstrap"


import Navbar from "../modules/autoNavbar"
// import Slide from "./slide"
import Footer from "./footer"
import Header from "./header"
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
        {/* <Slide /> */}
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>
          <Container>
            {children}
          </Container>
          </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
