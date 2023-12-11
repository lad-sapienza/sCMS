<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby's directus UI
</h1>

## 🚀 Quick start

1.  **Create a Gatsby site.**

   -  npm install -g gatsby-cli
   -  gatsby new gatsby-directus-ui https://github.com/r-ichard/gatsby-starter-bootstrap-5

2.  **Start developing.**

   -  cd gatsby-directus-ui
   -  gatsby develop

3.  **Open the source code and start editing!**

    - Your site is now running at `http://localhost:8000`
    - Graphql tool: `http://localhost:8000/___graphql`

4.  **Install gatsby-source-directus**

- npm i gatsby-source-directus -S
- In gatsby-config.js inserire

```
  plugins: [
    {
{
resolve: `gatsby-source-directus`,
options: {
url: `directus.example.com`, // base url
protocol: 'http', // protocollo
apiKey: '123456789', // API key che si trova nella pagina settings di Directus
nameExceptions: {
posts: "Article", // cambiare nome alle tabelle
},
requestParams: { // fa una richiesta all'API con parametri di default
depth: 2,
},
},
},}
  ],

```

5. **Create an .env file**

Crea un file .env dove memorizzare le tue variabili di sistema

- DIRECTUS_URL=https://directus.example.com
- DIRECTUS_TOKEN=mysecrettoken123

6.  **Install gatsby-plugin-env-variables**

- npm install gatsby-plugin-env-variables
- npm install colors

Il plugin gatsby-plugin-env-variables è progettato per consentire l'uso di variabili d'ambiente durante la fase di build di Gatsby.

In gatsby-config.js:
- nella opzione allowList si mettono i nomi delle variabili da considerare in fase di build.
- Per usare le variabili all'interno del sito si usa la dicitura process.env.NOME_VARIABILE

```
    plugins: [
    {
    resolve: "gatsby-plugin-env-variables",
    options: {
    allowList: ["DIRECTUS_URL", "DIRECTUS_TOKEN"],
    },
    },
    {
    resolve: "gatsby-source-directus",
    options: {
    url: process.env.DIRECTUS_URL,
    accessToken: process.env.DIRECTUS_TOKEN,
    // Altre opzioni di configurazione Directus...
    },
    },
    // ... altri plugin ...
    ],
  
  ```

## STEP DI SVILUPPO

### Backend

- [x] Installazione

  - [x] Tema boostrap 5
  - [x] Installazione plugin Directus
  - [x] Installazione plugin Env variables
  - [x] Creazione file Env 
  
  - [x] url del db 
  - [x] token di accesso
  - filtro, in caso non si voglia pubblicare tutto il contenuto del db, a solo parte di esso
  - campi che devono essere ricercabili
  - campi da usare per la produzione della possibile mappa
  - campi che devono essere visibili nella pagina record 

  - [x] Configurazione gatsby-config

### Frontend

 - [x] home page personalizzabile
-  []  seconda pagina ‘tipo’, che può essere personalizzata, ma anche duplicata n volte a creare altri contenuti statici
-  []  una pagina di ricerca su database Directus, configurabile
-  []  una pagina di elenco (o mappa) di risultati dalla ricerca sul database Directus configurabile
-  []  una pagina di records configurabile
