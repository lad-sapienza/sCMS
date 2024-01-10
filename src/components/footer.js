import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { Col, Container, Row } from "react-bootstrap"

const FooterPage = () => {
  return (
    <Footer>
      <Container fluid>
        <Row className="px-5 pt-5">
          <Col sm={2} xs={12} className="d-flex ">
            <div>
              <StaticImage
                src="../images/gatsby-icon.png"
                width={40}
                quality={30}
                formats={["AUTO", "WEBP"]}
                alt="logo"
                className="img-fluid"
              />
              <p className="footer-title">© Copyright</p>
            </div>
          </Col>

          <Col sm={2} xs={6} className="d-flex justify-content-end"></Col>
          <Col sm={2} xs={6} className="d-flex justify-content-end"></Col>
          <Col sm={2} xs={6} className="d-flex justify-content-end"></Col>
          <Col sm={2} xs={6} className="d-flex justify-content-end"></Col>
        </Row>
      </Container>
    </Footer>
  )
}

//style
const Footer = styled.section`
  .container-fluid {
    background-color: #ececec;
    border-top: #000 solid 1rem;
    min-height: auto;
  }

  a {
    color: #000;
    text-decoration: none;
    font-size: 0.7rem;
  }
  a:hover {
    color: #ddd;
    text-decoration: none;
    font-size: 0.7rem;
  }
  .footer-link {
    color: #fff;
    text-decoration: none;
    font-size: 0.7rem;
    padding: 0 2rem 0 2rem;
  }
  .footer-link:hover {
    color: #000;
    text-decoration: none;
    font-size: 0.7rem;
    padding: 0 2rem 0 2rem;
  }

  .footer-title {
    color: #000;
    font-family: "Cinzel";
    font-size: 0.6rem;
  }
  .Link-footer {
    width: 100%;
    text-align: center;
    padding: 20px;
  }
`

export default FooterPage
