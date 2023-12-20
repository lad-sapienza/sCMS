import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import { Row, Container } from "react-bootstrap"

import Layout from "../components/layout"
import { Seo } from "../components/seo"

const AboutPage = () => {
  const data = useStaticQuery(graphql`
    {
      directus {
        cms_articles(limit: 1, filter: { slug: { _eq: "home" } }) {
          id
          title
          slug
          summary
          text
        }
      }
    }
  `)
  return (
    <Layout>
      <Wrapper>
        <section className="py-5">
          <Container>
            <Row>
              <h1>{data.directus.cms_articles[0].title}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.directus.cms_articles[0].text,
                }}
              />
            </Row>
          </Container>
        </section>
      </Wrapper>
    </Layout>
  )
}

//style
const Wrapper = styled.section`
  .h1 {
    background-color: #f3e9e3;
  }
`

export default AboutPage

export const Head = () => <Seo title="About Gatsby Bootsrap 5 starter" />
