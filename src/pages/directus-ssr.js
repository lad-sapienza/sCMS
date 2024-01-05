import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const UsingSSRDirectus = ({ serverData }) => {
  console.log(serverData)
  return (
    <Layout>
      <h1>
        This page is <b>rendered server-side</b>
      </h1>
      <p>This page is rendered server side every time the page is requested.</p>
      <h1>Articoli di Directus</h1>
      <ul>
        {serverData.data.map(article => (
          <li key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            {/* Puoi aggiungere ulteriori dettagli o formattazione qui, come le immagini o il testo completo dell'articolo */}
          </li>
        ))}
      </ul>

      <p>
        To learn more, head over to our{" "}
        <a href="https://www.gatsbyjs.com/docs/reference/rendering-options/server-side-rendering/">
          documentation about Server Side Rendering
        </a>
        .
      </p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export const Head = () => <Seo title="Using SSR" />

export default UsingSSRDirectus

export async function getServerData() {
  try {
    const res = await fetch(
      `https://inrome.sns.it/db/${process.env.GATSBY_DIRECTUS_ENDPOINT}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_TOKEN}`, // Aggiungi il token all'header
        },
      }
    )
    if (!res.ok) {
      throw new Error(`Response failed`)
    }
    return {
      props: await res.json(),
    }
  } catch (error) {
    console.error("Errore nella richiesta API:", error)
    return null
  }
}
