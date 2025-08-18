import React, { useState, useEffect } from "react"

// Helper to strip two outermost divs from a HTML string
function stripWrappingDivs(html) {
  if (typeof html !== "string") return html
  // Remove first <div>...</div>
  html = html.replace(/^\s*<div[^>]*>([\s\S]*)<\/div>\s*$/, "$1")
  // Remove next <div>...</div>
  html = html.replace(/^\s*<div[^>]*>([\s\S]*)<\/div>\s*$/, "$1")
  return html
}

export default function ZoteroRecordsPreview({ groupId, tag }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tag) {
      setRecords([])
      setError(null)
      setLoading(false)
      return
    }
    let cancelled = false

    async function fetchAllRecords() {
      setLoading(true)
      setError(null)
      setRecords([])

      const atTag = `@${tag}`
      const baseUrl = `https://api.zotero.org/groups/${groupId}/items`
      const limit = 100
      const buildUrl = (start = 0) =>
        `${baseUrl}?sort=date&include=bib&tag=${encodeURIComponent(atTag)}&format=json&limit=${limit}&start=${start}`

      try {
        let all = []
        let start = 0
        let total = null
        let hasNext = true

        while (hasNext) {
          const resp = await fetch(buildUrl(start), {
            headers: { Accept: "application/json" },
          })
          if (!resp.ok)
            throw new Error(`Zotero API error: ${resp.status} ${resp.statusText}`)

          if (total == null) {
            const totalHeader = resp.headers.get("Total-Results") || resp.headers.get("total-results")
            if (totalHeader) {
              const n = parseInt(totalHeader, 10)
              if (!Number.isNaN(n)) total = n
            }
          }

          const page = await resp.json()
          if (cancelled) return

          all = all.concat(page)

          if (total != null) {
            hasNext = all.length < total
          } else {
            const link = resp.headers.get("Link") || resp.headers.get("link")
            if (link && /rel="next"/i.test(link)) {
              hasNext = true
            } else {
              hasNext = page.length === limit
            }
          }

          start += page.length

          // Update progressively so the UI shows results while loading
          setRecords([...all])
        }

        if (!cancelled) setRecords(all)
      } catch (err) {
        if (!cancelled) setError(err.message || "Error fetching records")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAllRecords()
    return () => {
      cancelled = true
    }
  }, [groupId, tag])

  if (!tag) return null
  return (
    <div style={{ marginTop: "2em" }}>
      <h4>
        Zotero records for <span style={{ color: "navy" }}>{tag}</span>
      </h4>
      {loading && <div>Loading records...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!loading && records && records.length > 0 && (
        <ol>
          {records.map(item => {
            const key = item.key || item.data?.key
            const zoteroLink = key
              ? `https://www.zotero.org/groups/${groupId}/items/${key}`
              : null
            return (
              <li
                key={key}
                style={{
                  marginBottom: ".5em",
                  textIndent: "-1em",
                  paddingLeft: "1em"
                }}
              >
                {item.bib ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: stripWrappingDivs(item.bib),
                    }}
                  />
                ) : item.data && item.data.title ? (
                  item.data.title
                ) : (
                  JSON.stringify(item)
                )}
                {zoteroLink && (
                  <React.Fragment>
                    <br />
                    <a
                      href={zoteroLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.95em",
                        textDecoration: "underline",
                        whiteSpace: "nowrap"
                      }}
                    >
                      View in the Zotero Library
                    </a>
                    </React.Fragment>
                )}
              </li>
            )
          })}
        </ol>
      )}
      {!loading && (!records || records.length === 0) && !error && (
        <div className="text-danger">No records found for this tag.</div>
      )}
    </div>
  )
}
