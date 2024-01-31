import * as React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { withPrefix } from "gatsby"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"

function MyNavbar(props) {
  const data = useStaticQuery(graphql`
    {
      allMdx (
        filter: {frontmatter: {menu_position: {gt: 0}}}
        sort: {frontmatter: {menu_position: ASC}}
      ) {
        nodes {
          id
          frontmatter {
            slug
            title
          }
        }
      }
    }
  `)
  return (
    <Menu>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">{props.siteTitle}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {data.allMdx.nodes.map((menuItem, index) => (
                <div className="containerLink" key={index}>
                  <Nav.Link
                    href={withPrefix(`/${menuItem.frontmatter.slug}`)}
                    className="nav-item my-2"
                  >
                    {menuItem.frontmatter.title}
                  </Nav.Link>
                </div>
              ))}
              {/* <Nav.Link href="/searchPage" className="nav-item my-2">
                Search
              </Nav.Link>
              <Nav.Link href="/datatable" className="nav-item my-2">
                Datatable
              </Nav.Link>
              <Nav.Link href="/mappa-json" className="nav-item my-2">
                Map GeoJson data
              </Nav.Link>
              <Nav.Link href="/mappa-directus" className="nav-item my-2">
                Map Directus data
              </Nav.Link> */}
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
