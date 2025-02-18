import * as React from "react"
import styled from "styled-components"
import { Container } from "react-bootstrap"
import SCMSLogo from "../../modules/scmsLogo"

const FooterSection = () => {
  return (
    <Footer>
      <Container>
        <div className="d-flex flex-row align-items-center mb-3">
          <div className="p-3">
          <SCMSLogo links={true} />
          </div>
          <div className="p-3 border-start border-primary">
            <p className="p-s-3">
              <strong>s:CMS</strong> è un progetto ideato e sviluppato dal{" "}
              <br />
              <a
                href="https://lad.saras.uniroma1.it"
                target="_blank"
                rel="noreferrer"
              >
                LAD: Laboratorio di Archeologia Digitale alla Sapienza
              </a>
              <br />
              <a
                href="https://github.com/lad-sapienza/sCMS"
                target="_blank"
                rel="noreferrer"
              >
                Code
              </a>
              &nbsp;|&nbsp;
              <a
                href="https://github.com/lad-sapienza/sCMS/issues"
                target="_blank"
                rel="noreferrer"
              >
                Issues
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Footer>
  )
}

//style
const Footer = styled.footer`
  background-color: #ececec;
  border-top: #000 solid 0.5rem;
  min-height: auto;
  margin-top: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`

export default FooterSection
