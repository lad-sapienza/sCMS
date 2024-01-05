import * as React from "react"
import { navigate } from "gatsby"

const SearchForm = () => {
  const [query, setQuery] = React.useState("")

  const handleSubmit = e => {
    e.preventDefault()
    navigate(`/searchResult/?query=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Cerca..."
      />
      <button type="submit">Cerca</button>
    </form>
  )
}

export default SearchForm
