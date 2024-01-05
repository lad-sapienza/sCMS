import React, { useEffect, useState } from "react"
import { useLocation } from "@reach/router"
import Layout from "../components/layout"

const SearchResult = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query = queryParams.get("query") || ""
  const [results, setResults] = useState([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `https://inrome.sns.it/db/${process.env.GATSBY_DIRECTUS_ENDPOINT}?filter[title][_ilike]=%${query}%`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_TOKEN}`,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setResults(data.data)
        } else {
          throw new Error("Failed to fetch results")
        }
      } catch (error) {
        console.error("Error fetching results:", error)
      }
    }

    fetchResults()
  }, [query])

  return (
    <Layout>
      <div>
        <h1>Search Results for "{query}"</h1>
        <ul>
          {results.map(article => (
            <li key={article.id}>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default SearchResult
