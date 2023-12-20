<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby's directus UI
</h1>

## 🚀 USER HOW TO

## 🚀 DEVELOPER HOW TO

1.  **Create a Gatsby site.**

- npm install -g gatsby-cli
- gatsby new gatsby-directus-ui https://github.com/r-ichard/gatsby-starter-bootstrap-5

2.  **Start developing.**

- cd gatsby-directus-ui
- gatsby develop

3.  **Open the source code and start editing!**

    - Your site is now running at `http://localhost:8000`
    - Graphql tool: `http://localhost:8000/___graphql`

4.  **CREATE FILE .ENV**

https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/

Gatsby ha il supporto integrato per il caricamento delle variabili di ambiente nel browser e nelle Funzioni. Il caricamento delle variabili di ambiente in Node.js richiede un piccolo snippet di codice.

In fase di sviluppo, Gatsby caricherà le variabili di ambiente da un file denominato .env.development.
Per le build, verrà caricato da .env.production.

- Create a .env.production file

- DIRECTUS_URL=https://directus.example.com
- DIRECTUS_TOKEN=mysecrettoken123

- Create a .env.development file

- DIRECTUS_URL=https://directus.example.com
- DIRECTUS_TOKEN=mysecrettoken123

- Update gatsby-config.js

```
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

```

5.  **Install plugins**

- A. Install gatsby-source-directus

npm install --save gatsby-source-graphql@5 gatsby-source-filesystem@5

npm install --save @directus/gatsby-source-directus

- Update gatsby-config.js

```
 {
      resolve: "@directus/gatsby-source-directus",
      options: {
        url: process.env.DIRECTUS_URL, // Usa le variabili del file env
        auth: {
          token: process.env.DIRECTUS_TOKEN, //Usa le variabili del file env
        },
      },
    },

```

- B. Install gatsby-source-graphql (Query runtime)

- npm install gatsby-source-graphql

- Update gatsby-config.js

```

{
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `GitHub`,
        fieldName: `github`,
        url: `https://api.github.com/graphql`,
        headers: {
          Authorization: `Bearer your-github-token`,
        },
      },
    },

```

- B. Install Gatsby styled-component

- npm install gatsby-plugin-styled-components styled-components babel-plugin-styled-components
- Update gatsby-config.js

```
plugins: [`gatsby-plugin-styled-components`],

```

- C. install react-boostraps

- npm install react-bootstrap bootstrap

- D. Install gatsby-plugin-env-variables

Questo plugin server per avere varibiali configurabili in run time

## STEP DI SVILUPPO

### Backend

- [x] Installazione
  - [x] Tema boostrap 5
  - [x] Installazione plugin Directus
  - [x] Configurazione gatsby-config
  - [x] Creazione file Env
    - [x] url del db
    - [x] token di accesso
    - [] filtro, in caso non si voglia pubblicare tutto il contenuto del db, a solo parte di esso
    - [] campi che devono essere ricercabili
    - [] campi da usare per la produzione della possibile mappa
    - [] campi che devono essere visibili nella pagina record
- [] Aggiornamento run time https://www.gatsbyjs.com/docs/conceptual/data-fetching/

### Frontend

- [x] home page personalizzabile
- [] seconda pagina ‘tipo’, che può essere personalizzata, ma anche duplicata n volte a creare altri contenuti statici
- [] una pagina di ricerca su database Directus, configurabile
- [] una pagina di elenco (o mappa) di risultati dalla ricerca sul database Directus configurabile
- [] una pagina di records configurabile
