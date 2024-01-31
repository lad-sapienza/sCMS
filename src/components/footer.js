import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { Link } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"

const FooterPage = () => {
  return (
    <Footer>
      <Container fluid>
        <Row className="px-5 pt-5">
          <Col sm={6} xs={12} className="d-flex ">
            <div>
              <Link href="/">
                <StaticImage
                  src="../images/lad.png"
                  width={100}
                  quality={30}
                  formats={["AUTO", "WEBP"]}
                  alt="LAD: Laboratorio di Archeologia Digitale alla Sapienza"
                  className="img-fluid"
                />
              </Link>
              <p>Laboratorio di Archeologia Digitale alla Sapienza</p>
            </div>
          </Col>

          
        </Row>
      </Container>
    </Footer>
  )
}

//style
const Footer = styled.section`
  background-color: #ececec;
  border-top: #000 solid .5rem;
  min-height: auto;
  margin-top: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  
  a {
    color: #000;
    text-decoration: none;
    font-size: 0.7rem;
  
    &:hover {
      color: #ddd;
      text-decoration: none;
      font-size: 0.7rem;
    }
  }
`

export default FooterPage
