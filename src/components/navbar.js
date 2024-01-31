import * as React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import styled from "styled-components"

function MyNavbar(props) {
  return (
    <Menu>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">{props.siteTitle}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/src/contents/test.mdx">Page MDX</Nav.Link>
              <Nav.Link href="/searchPage">Search</Nav.Link>
              <Nav.Link href="/datatable">Datatable</Nav.Link>
              <Nav.Link href="/mappa-json">Map GeoJson data</Nav.Link>
              <Nav.Link href="/mappa-directus">Map Directus data</Nav.Link>
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
export default MyNavbar
