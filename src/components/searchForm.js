import React, { useState } from "react"
import { navigate } from "gatsby"

const SearchForm = () => {
  const [query, setQuery] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    navigate(`/searchResult/?query=${query}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchForm
