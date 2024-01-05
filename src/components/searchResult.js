import React from "react"

const SearchResult = ({ serverData }) => {
  return (
    <div>
      {serverData.data.map(item => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  )
}

export default SearchResult
