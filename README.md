# s:CMS

A static site Content Management System developend and maintained by LAD: Laboratorio di Archeologia Digitale alla Sapienza 

s:CMS is an easy, open source and ready-to-use content management system for [generating static sites](https://www.cloudflare.com/en-gb/learning/performance/static-site-generator/) based on [Gatsby.js](https://www.gatsbyjs.com/). It also implements data-oriented components for easily **connecting**, **displaying** and **analysing** research data stored in databases, in flat files or remotely, in an easy, informative and efficient way: maps, searchable tables, and soon to come charts. 

Our aim is to enable researchers to publish online rich data portals, by pulling the information from a wide range of sources, be them flat static files, remotely accessible services, or online databases. We try to build components — resuing as much as possible well known open source projects — to make the integration seemless and to offer a simplified workflow to securely publish contents.

Static sites are fast, secure, durable: no databases to manage, no code that gets outdated, no performace issues. Once you have build and deployed your site, you are sure it will never stop working.

### What can I do with s:CMS?
You can setup in few minutes a fully working and secure website containing static pages, with text and images describing your project and also rich data pulled in real time from remote databases and or self-hosted as static files, with which you can build maps, and fully searcheable tables. You are fully enabled to customise the layout and look&feel of your site to perfectly fit your needs.

Think of s:CMS as the *public, fully-customiseable front-end of your research database*


## Table of contents

1. [Environment setup](#environment-setup)
1. [Installing s:CMS](#installing-scms)
1. [Edit site's metadata](#edit-sites-metadata)
1. [Connecting to a default Directus instance](#connecting-to-a-default-directus-instance)
1. [Customise site's layout and look & feel](#customise-sites-layout-and-look--feel)
1. [Adding content](#adding-content)
1. [Deploy your site for free on Github Pages](#deploy-your-site-for-free-on-github-pages)
1. [Update the site to the latest version](#update-the-site-to-the-latest-version)
1. [Built with s:CMS](#build-with-sCMS)


## Environment setup
To use s:CMS, you need to have a working environment. s:CMS is basically a Gatsby starter ([more about starters](https://www.gatsbyjs.com/docs/how-to/local-development/starters/)), completed with custom components that are already ready to use. 
[Gatsby.js](https://www.gatsbyjs.com/) is a static site generator that allows you to create static websites by using React and GraphQL. It is a great tool for creating websites that are fast, secure, and durable. It is also a great tool for creating websites that are easy to maintain. It runs on [Node.js](https://nodejs.org/), a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts and [React](https://react.dev/), a library for web and native user interfaces developed by Meta.

You need to install [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) ans the [Gatsby CLI](https://www.gatsbyjs.com/docs/reference/gatsby-cli) (command line interface) to be anbe to install and customise s:CMS.


## Installing sCMS

Open a terminal or command prompt window and type (or copy/paste)

```bash
npx gatsby new {my-new-site} https://github.com/lad-sapienza/sCMS
```

Make sure to replace `{my-new-site}` in the command above with the name of your own project. The gatsby CLI will create e new folder, named {my-new-site} and will download into it the s:CMS starter.

After, change the working directory to get inside your project:

```bash
cd {my-new-site}
```

and finally install all the dependencies by running:

```bash
npm install
```

**Please note**: `npm i` is a shorthand for `npm install` so you can use it instead of typing the full command.

The installing of the dependencies might require up to few minutes, depending on your connection. When it finishes, run:

```bash
npm start
```

to start the development server. The site will be available at the the default URL [http://localhost:8000](http://localhost:8000). To stop the server type `CTRL + C`.

Open the `{my-new-site}` folder with your favorite code editor and start editing the code tu customise the site. Your edits will be previewed in real time at [http://localhost:8000](http://localhost:8000).

## Edit site's metadata
The principal metadata of the site can be changed by editing `gatsby-config.js` file located in the root of your installation. Lines 15-21 are the ones that define the metadata of the site and look by defauld as follows:

```js
...
pathPrefix: process.env.NODE_ENV === "production" ? "/sCMS/" : "/",
siteMetadata: {
    title: `s:CMS`,
    description: `S:CMS | Static site Content Managemt System is developend and maintained by LAD: Laboratorio di Archeologia Digitale alla Sapienza`,
    author: `Julian Bogdani <julian.bogdani@uniroma1.it>`,
    siteUrl: `https://github.com/lad-sapienza/sCSM#readme`,
  },
...
```

Feel free to change
- `title`: the default title attribute of the site
- `description`: the default descriprion attribute of the site
- `author`: the default author attribute of the site
- `siteUrl`: The URL where the site is available

If is also important to change at line 15: `pathPrefix` to match the relative URL where the site will be published.

This is a very impornt passage, since its misconfiguration might determine wrong paths for internal links.

> Edits of the `gatsby-config.js` file will require the restart of the developing server to get updated. Get back to the terminal window, stop the running server by typig `CTRL + C` and start it again by entering `npm start`.

## Connecting to a default Directus instance

s:CMS is designed to work seemlessly with [Directius.io](https://directus.io/), a composable data platform purpose-built for democratizing the world's data.

To access the data stored in a Directus instance you need typically a Directus endpoint, i.e. the URL where Directus is running and an [authentication token](https://docs.directus.io/reference/authentication.html).

Create a file in the root of your project named `.env.development` and add two lines with the following content:

```env
GATSBY_DIRECTUS_ENDPOINT={url-of-your-directus-instance}
GATSBY_DIRECTUS_TOKEN={directus-token}
```

and replace `{url-of-your-directus-instance}` and `directus-token` with the URL of your Directus instance and the token of your instance.

Save and close the file and re-start the development server by typing `CTRL + C` and then `npm start` in the terminal.

## Customise site's layout and look & feel

sCMS comes with a default template and a set of example pages. By design, we are not aiming at developing templates: layout and graphics are entirely on your own. Nevertheless sCMS is delivered with a set of tools — such as [React Bootstrap](https://react-bootstrap.github.io/) — that make it easy to write your own templates or customise the default one.

The files responsible for layouting are collected in the `src/usr/layout/` directory.
You can customise the header, the footer, the general layout and stying by editing:
- `header.js`: the component used to display the header
- `footer.js`: the component used to display the footer
- `layout.js`: the scaffold component of the layout. You ba create highly customised layouts **without** the need to edit the main layout.js file.
- `layout.scss`: the [SASS](https://sass-lang.com/documentation/syntax/) file containing the styling.

> **Please note** that you should not edit `layout.css`, `layout.css.map` since this files are being created and updated by the system each time that layout.scss is being updated.

Other assets, such as static image files can be added in the `src/usr/images/` folder or in the `static/` folder. Add to `src/usr/images/` files to be used with the [Gatsby Image Plugin](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/) and similar. Images ad other files saved in the `static/` folder will be copied as they (and without any transformation) are in the publically available version of the site.


## Adding content

s:CMS also provide tools for easily build and personalize the pages of your website. Being based on Gatsby, every such page works with the [MDX Markdown extension](https://www.gatsbyjs.com/docs/glossary/mdx/). 

Each MD or MDX file saved in `src/usr/contents/` folder will be automatically processed to become a publically available page of the site.


### 1. Front Matter

Firstly, it is important that you can configure every page's visualization using metadata that are disposed by default:

| Field | Required | Example | Description |
|---|---|---|---|
| `title` | Yes | `Welcome to or new and shiny s:CMS based web site`  | Define the name shown for the page and on the navbar                        |
| `date` | no | 2024-04-10 | Define the date of creation/last update of the page |
| `slug` | yes | `welcome` | Define the personalized ending of the URL address specific to the page.  |
| `menu_position`   | No | 0 | Define the internal indexing of the page used for the correct ordering in the navbar. |

### 2. Static page

As the most basic unit of your website, you can add one or more static pages integrating text, links, and images. The MDX structure permits you to easily use Markdown and HTML syntax, and also allows you to integrate static query components to further personalize your page.

### 3. Pages with dynamic content:

s:CMS provides you a full arrangement of features for building pages integrating static content (text, images, links) with dynamic data (accessed by an Ajax call) taken from a relational database. The system is optimized for online databases managed by Directus, but local access can also be used.

#### 3.1. Maps

s:CMS gives you the chance to build a web-GIS map composed by the juxtaposition of Raster and Vector layers. Various tools are provided for helping customize both the graphical rendering of the wrapper and the visualization of the content.

For the RASTER bases, a simplified access to the most common providers of satellite imagery and digital maps is provided by default, with the possibility to extend the selection to custom maps. Tools are also provided for full customization of vector layers, from data filtering to icon customization. For more complex projects, a layer selector is provided to allow users a cleaner data visualization.

#### 3.2. Table

You can also add a table to organically show your data in an intuitive format! The table component provides options for a front-end general filter. With various graphical configuration options, the presentation of data can be customized to fit the specific needs of the project. Additionally, you can choose which fields to display and customize how they are presented, adding external and/or internal links or preview images that mirror outside sources.

(Learn how: [Dtable](#dtable))

#### 3.3. Search page

Enhance the navigation of your data by adding a query page. This easily customizable tool supports various query logics and result presentations, allowing you to select which fields are searchable and how the results are displayed. You can also include links to external resources, internal pages, or even previews of content.

(Learn how: [Search](#search))

#### 3.4. Record page

A page that displays an item's details in a simple list format and can be customized to fit your needs. The record page can be accessed only through direct links from other pages on the site, providing a comprehensive view of complex information and allowing for detailed exploration that may not be fully covered in summary pages.

(Learn how: [View Record](#view-record))

## Deploy your site for free on Github Pages

`Documentation to be completed`

## Update the site to the latest version

S:CMS comes with two commands to update the site to the latest version:

```bash
npm run upgrage-main
```

will updated the site using the [`main` branch](https://github.com/lad-sapienza/sCMS/) as the suource for the files, and 

```bash
npm run upgrage-dev
```

will use the [`dev` branch](https://github.com/lad-sapienza/sCMS/tree/dev).

> Please note that the upgrade command requires `rsync` to run. [rsync](https://en.wikipedia.org/wiki/Rsync) is a utility for transferring and synchronizing files between a computer and a storage drive and across networked computers by comparing the modification times and sizes of files. It is commonly found on Unix-like operating systems and is under the GPL-3.0-or-later license.  
> Run `which rsync` in your terminal to check if `rsync` is available.

---

## Built with s:CMS
- [LAD](https://lad.saras.uniroma1.it/): sito web ufficiale del Laboratorio di Archeologia Digitale alla Sapienza.
- [Borderscape](https://webgis.borderscapeproject.org/): WebGIS State Formation and Settlement Patterns in the Ancient Egyptian Southern Border, 4th-3rd millennia BCE
- [ElaMortuary](https://lad-sapienza.github.io/elamortuary/): Villages to Empire: 4,000 Years of Death and Society in Elam (4500-525 BCE)
- [Pre-Islamic Afghanistan](https://lad-sapienza.github.io/pre-islamic-afghanistan/): Archaeology and cultural heritage of pre-Islamic Afghanistan: Sites and materials. With a focus on the Buddhist clay sculptures