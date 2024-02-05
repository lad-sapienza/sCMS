import * as React from "react"
import { Link, withPrefix } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { Container } from "react-bootstrap"

const HeaderSection = ({ siteTitle }) => (
  <Header>
    <Container>
      <div className="d-flex flex-row align-items-center mb-3">
        <Link to={ withPrefix('/') }>
          <StaticImage
            src="../images/scms-lad.png"
            width={150}
            quality={80}
            formats={["AUTO", "WEBP"]}
            alt={siteTitle}
            className="img-fluid"
          />
        </Link>
        <div className="ms-3">
          S:CMS | Static site Content Managemt System is developend and
          maintained by LAD: Laboratorio di Archeologia Digitale alla Sapienza
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
