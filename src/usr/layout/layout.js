import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { Container } from "react-bootstrap"

import Navbar from "../modules/autoNavbar"
import {SimpleSlider} from "../modules/scms"
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
        <SimpleSlider data={[
          {
            img: "/images/slide_1.jpg",
            caption: "test #1",
          },
          {
            img: "/images/slide_2.jpg",
            caption: "test #2",
          },
          {
            img: "/images/slide_3.jpg",
            caption: `<div>"test #3"</div>`,
          },
        ]} />
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>
          <Container>{children}</Container>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
