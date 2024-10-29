import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { Container } from "react-bootstrap"

const HeaderSection = ({ siteTitle }) => (
  <Header>
    <Container>
      <div className="d-sm-flex align-items-center text-center">
        <Link to={"/"}>
          <StaticImage
            src="../../images/scms-lad.png"
            width={150}
            quality={80}
            formats={["AUTO", "WEBP"]}
            alt={siteTitle}
            className="img-fluid"
          />
        </Link>
        <div className="text-start ms-3">
          <h1>s:CMS</h1>
          <p className="lead">Static site Content Management System is developend and
          maintained by LAD: Laboratorio di Archeologia Digitale alla Sapienza</p>
        </div>
      </div>
    </Container>
  </Header>
)

const Header = styled.header`
  background-color: #fe04fc;
  color: #ffffff;
  margin-bottom: 5rem;

  .gatsby-image-wrapper {
    background-color: #ffffff;
    img {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`

export default HeaderSection
