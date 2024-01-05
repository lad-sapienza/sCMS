import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { Link } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"

const FooterPage = () => {
  return (
    <Footer className="mt-5">
      <Container>
        <Row className="px-5 pt-5">
          <Col sm={2} xs={12}>
            <div>
              <Link to="/">
                <StaticImage
                  src="../images/gatsby-icon.png"
                  width={40}
                  quality={30}
                  formats={["AUTO", "WEBP"]}
                  alt="logo"
                  className="img-fluid"
                />
              </Link>
              <p className="footer-title">© LAD 2023 - { new Date().getFullYear() }</p>
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
`

export default FooterPage
