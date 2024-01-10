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

The base confuguratio requires you to create a ENV file that contains main configuration that allows communication with the directus database. This file contains sensible data and should not be deployed in a typical production scenario.

Info: [https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)

Gatsby ha il supporto integrato per il caricamento delle variabili di ambiente nel browser e nelle Funzioni. Il caricamento delle variabili di ambiente in Node.js richiede un piccolo snippet di codice.

In fase di sviluppo, Gatsby caricherà le variabili di ambiente da un file denominato .env.development.
Per le build, verrà caricato da .env.production.

Create a `.env.production` file:

```
DIRECTUS_URL=https://directus.example.com
GATSBY_DIRECTUS_TOKEN=mysecrettoken123
GATSBY_DIRECTUS_ENDPOINT=items/name_collection
```

Create a `.env.development` file

```
DIRECTUS_URL=https://directus.example.com
GATSBY_DIRECTUS_TOKEN=mysecrettoken123
GATSBY_DIRECTUS_ENDPOINT=items/name_collection
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

### Install `Gatsby`

Install a Gatsby default starter theme

```bash
gatsby new directus-ui-gatsby
cd directus-ui-gatsby
```

### Install plugin `react-boostrap`

This plugins makes availeble in Gatsby [Bootstrap's 5](https://getbootstrap.com/) components, rebuilt for [React.js](https://reactjs.org/).

```bash
npm install --save react-bootstrap bootstrap
```

### Install plugin `gatsby-plugin-sass`

Provides drop-in support for Sass/SCSS stylesheets

```bash
npm install gatsby-plugin-sass
```

- Create a file layout.scss
- In gatsby-browser.js add:

```
import "bootstrap/dist/css/bootstrap.min.css"
```

- In gatsby-config.js add

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    {
      resolve: `gatsby-plugin-sass`,
      options: { implementation: require("sass") },
    },
  ],
}
```

- In layout.scss add:

```
//Here you can customize bootstrap
$primary: #663399;
@import "~bootstrap/scss/bootstrap.scss";
```

### Install plugins `styled-components`, `gatsby-plugin-styled-components`, and `babel-plugin-styled-components`

This adds [styled-components](https://styled-components.com/) functionality to the Gatsby site, to facilitate the CSS costimisation of the site within JavaScript. For further information:

- https://www.gatsbyjs.com/docs/how-to/styling/styled-components/
- https://styled-components.com/

```bash
npm install --save gatsby-plugin-styled-components styled-components babel-plugin-styled-components
```

Update gatsby-config.js and add to the plugins array `gatsby-plugin-styled-components`:

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugins
    `gatsby-plugin-styled-components`,
  ],
}
```

### Enable environmental variables

Gatsby has built-in support for loading environment variables into the browser and Functions. Loading environment variables into Node.js requires a small code snippet.

In development, Gatsby will load environment variables from a file named `.env.development`. For builds, it will load from `.env.production`.

To load these into Node.js, add the following code snippet to the top of your gatsby-config.js file:

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

Further information available at: [https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)

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

### Add Search engine

https://docs.directus.io/reference/filter-rules.html

### Install plugin Leaflet

```
npm i --save gatsby-plugin-react-leaflet react-leaflet leaflet
```

```
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
      }
    }
  ]
}
```

### Install plugin MD

```js
module.exports = {
  // ... some gatsby configuration
  plugins: [
    // ... some gatsby plugin
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
      },
    },
  ],
}
```

## STEP DI SVILUPPO

### Backend

- [x] Installazione

  - [x] Creazione file Env
    - [x] url del db
    - [x] token di accesso
    - [] filtro, in caso non si voglia pubblicare tutto il contenuto del db, a solo parte di esso
    - [] campi che devono essere ricercabili
    - [] campi da usare per la produzione della possibile mappa
    - [] campi che devono essere visibili nella pagina record

### Frontend

- [x] Home page personalizzabile
- [x] seconda pagina ‘tipo’, che può essere personalizzata, ma anche duplicata n volte a creare altri contenuti statici
- [x] pagina SSR per contenuti runtime
- [x] una pagina di ricerca su database Directus, configurabile
- [] una pagina di elenco (o mappa) di risultati dalla ricerca sul database Directus configurabile
- [] una pagina di records configurabile
