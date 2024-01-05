import * as React from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import styled from "styled-components"

function Links() {
  return (
    <Menu>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Project-name</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/page-2">Page2</Nav.Link>
              <Nav.Link href="/using-ssr">Server side content</Nav.Link>
              <Nav.Link href="/directus-ssr">Directus SSR</Nav.Link>
              <Nav.Link href="/searchPage">Search</Nav.Link>
              <Nav.Link href="#">Maps</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Menu>
  )
}

//style
const Menu = styled.section`
  .bg-body-tertiary {
    background-color: #ececec !important;
  }
`
export default Links
