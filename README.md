<h1 align="center">
  Gatsby & Directus UI
</h1>

# User's guide

## Environmente setup
To succesfully run, edit and deploy Gatsby & Directus UI few dependencies are required. This guide does not cover their installation or setup.

- [Node.js](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- A code editor, such as the free [Visual Studio Code](https://code.visualstudio.com/)
- A [free Github](https://github.com/) account


## Installation

```bash
git clone https://github.com/lab-archeologia-digitale/gatsby-directus-ui.git
cd gatsby-directus-ui
npm install
```

After this, the main dependencieas are installed, but before running te site we need to do some base configuration.

We raccomend to use [Visual Studio Code](https://code.visualstudio.com/) or another code editor to edit the source code and customise the site. 


## Base configuration

The base confuguratio  requires you to create a ENV file that contains main configuration that allows communication with the directus database. This file contains sensible data and should not be deployed in a typical production scenario.

Info: [https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)

Gatsby ha il supporto integrato per il caricamento delle variabili di ambiente nel browser e nelle Funzioni. Il caricamento delle variabili di ambiente in Node.js richiede un piccolo snippet di codice.

In fase di sviluppo, Gatsby caricherà le variabili di ambiente da un file denominato .env.development.
Per le build, verrà caricato da .env.production.

Create a `.env.production` file:

```
DIRECTUS_URL=https://directus.example.com
DIRECTUS_TOKEN=mysecrettoken123
```

Create a `.env.development` file

```
DIRECTUS_URL=https://directus.example.com
DIRECTUS_TOKEN=mysecrettoken123
```

## Run and test

We are finally ready to run our site
```bash
npm run develop
```
If everything was successfull, your site shoud be runnin at `http://localhost:8000`. The GraphQL tool should be available at: `http://localhost:8000/___graphql`

## Further customisation
- come aggiungere una pagina statica
- come modificare un menu
- come ....?

## Build

## Deploy

## Secure your application

---




---

# What's inside: developers guide

Gatsby & Directus UI is a custom Gatsby application, packed with specific plugins to allow runtime communication with a Directus database instance.

Our aim is to keep it as simple as possible, but also provide means to further develop it. The following part of the guide explains the few steps we followed to put everything together, and some optinal further implementations.

### Install `Gatsby Bootstrap 5 starter`

Follow the instruction at https://github.com/r-ichard/gatsby-starter-bootstrap-5 to install a Gatsby starter built wth [Bootstrap 5](https://getbootstrap.com/)

```bash
git clone https://github.com/r-ichard/gatsby-starter-bootstrap-5.git
cd gatsby-starter-bootstrap-5
```

### Install plugin `react-boostrap`

This plugins makes availeble in Gatsby [Bootstrap's 5](https://getbootstrap.com/) components, rebuilt for [React.js](https://reactjs.org/).

```bash
npm install --save react-bootstrap bootstrap
```

> @eiacopini valuare la coesistenza di questo con lo starter sopra. Non sono alternative? Probabilmente potremmo fare a meno dello starter


### Install plugins `styled-components`, `gatsby-plugin-styled-components`, and `babel-plugin-styled-components`

This adds [styled-components](https://styled-components.com/) functionality to the Gatsby site, to facilitate the CSS costimisation of the site within JavaScript. For further information:
- https://www.gatsbyjs.com/docs/how-to/styling/styled-components/
- https://styled-components.com/

```bash
npm install --save gatsby-plugin-styled-components styled-components babel-plugin-styled-componenst
```

Update gatsby-config.js and add to the plugins array `gatsby-plugin-styled-components`:

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    `gatsby-plugin-styled-components`,
  ]
}
```

### Install plugin `gatsby-source-graphql`

This plugin is used to connect to retrieve data in runtime by using GraphQL from the Directus database. 

For further information: [https://www.gatsbyjs.com/plugins/gatsby-source-graphql/](https://www.gatsbyjs.com/plugins/gatsby-source-graphql/)

```bash
npm install --save gatsby-source-graphql
```

Update gatsby-config.js and add to the plugins array:

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `GitHub`, @eiacopini: da cambiare immagino con variabile ENV
        fieldName: `github`, @eiacopini: da cambiare immagino con variabile ENV
        url: `https://api.github.com/graphql`, @eiacopini: da cambiare immagino con variabile ENV
        headers: {
          Authorization: `Bearer your-github-token`, @eiacopini: da cambiare immagino con variabile ENV
        },
      }
    },
  ],
}
```


### Install plugin `gatsby-source-directus`

The plugin makes it easy to connect Gatsby to a Directus instace.

> @eiacopini questo plugin serve se vogliamo usare Directus come fonte di contenuto, es. per le pagine statice, ma non è strettamente necessario per il primo fine dell'app. Forse lo aggiungerei come bonus, non come setup core. Invece aggiungerei il supporto per MD (e sempre come bonus per MDX). Nella versione più semplice l'app funziona con contenuti statici.

```bash
npm install --save gatsby-source-graphql@5 gatsby-source-filesystem@5
```

Update gatsby-config.js and add to the plugins array:

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    {
      resolve: "@directus/gatsby-source-directus",
      options: {
        url: process.env.DIRECTUS_URL,
        auth: {
          token: process.env.DIRECTUS_TOKEN
        }
      }
    },
  ],
}
```

The variables `DIRECTUS_URL` and `DIRECTUS_TOKEN` must be defined in the `.env` file (see below) and will be injected in real time into the application.


### Enable environmental vaiables

Gatsby has built-in support for loading environment variables into the browser and Functions. Loading environment variables into Node.js requires a small code snippet.

In development, Gatsby will load environment variables from a file named `.env.development`. For builds, it will load from `.env.production`.

To load these into Node.js, add the following code snippet to the top of your gatsby-config.js file:

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

Further information available at: [https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)



### Install plugin `gatsby-plugin-env-variables`

> @eiacopini: ci serve davvero questo plugin? Loro dicono che Gatsby di default carica solo varibili env con prefisso GATSBY_ ma nella documentazione https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/ ufficiale vengono usare anche variabili senza quel prefisso. Se non serve lo eliminiamo.

By default, Gatsby only makes system environment variables prefixed with `GATSBY_` available to client scripts. Using this plugin, you can make any arbitrary environment variable available at runtime.


```bash
npm install --save gatsby-plugin-env-variables
```

Update gatsby-config.js and add to the plugins array:

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    {
      resolve: "gatsby-plugin-env-variables",
      options: {
        allowList: ["DIRECTUS_URL", "DIRECTUS_TOKEN"]
      },
    },
  ],
}

```





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
