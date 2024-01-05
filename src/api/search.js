export default async function handler(req, res) {
  const { query } = req.query

  try {
    const resFromDirectus = await fetch(
      `https://inrome.sns.it/db/${process.env.GATSBY_DIRECTUS_ENDPOINT}?filter[title][_icontains]=${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_TOKEN}`, // Aggiungi il token all'header
        },
      }
    )

    if (!resFromDirectus.ok) {
      throw new Error(`Response failed`)
    }

    const searchResults = await resFromDirectus.json()

    res.status(200).json(searchResults)
  } catch (error) {
    console.error("Errore nella richiesta API:", error)
    res.status(500).json({ error: "Errore nella ricerca" })
  }
}
