import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import SearchForm from "../components/searchForm"

const Search = () => (
  <Layout>
    <h1>Search</h1>
    <SearchForm />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export const Head = () => <Seo title="Pagina di ricerca" />

export default Search
