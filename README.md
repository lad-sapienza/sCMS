# s:CMS

s:CMS is an easy, open source and ready-to-use content management system for [generating static sites](https://www.cloudflare.com/en-gb/learning/performance/static-site-generator/) based on [Gatsby.js](https://www.gatsbyjs.com/). It also implements data-oriented components for easily **connecting**, **displaying** and **analysing** research data stored in databases, in flat files or remotely, in an easy, informative and efficient way: maps, searchable tables, and soon to come charts. 

Our aim is to enable researchers to publish online rich data portals, by pulling the information from a wide range of sources, be them flat static files, remotely accessible services, or online databases. We try to build components — resuing as much as possible well known open source projects — to make the integration seemless and to offer a simplified workflow to securely publish contents.

### What is Gatsby.js
> Gatsby is a React-based open source framework for creating websites. Whether your site has 100 pages or 100,000 pages — if you care deeply about performance, scalability, and built-in security — you'll love building with us. Start pulling data from your favorite headless CMS easily!  
— [https://www.gatsbyjs.com/docs](https://www.gatsbyjs.com/docs)

### Why static sites
Static sites are fast, secure, durable: no databases to manage, no code that gets outdated, no performace issues. Once you have build and deployed your site, you are sure it will never stop working.

## Table of contents

1. [What can I do with s:CMS?](#what-can-i-do-with-sCMS?)
1. [Preliminary operations](#preliminary-operations)
   1. [Installing Visual Studio Code](#installing-visual-studio-code)
   1. [Installing Node.js](#installing-node-js)
1. [Installing sCMS](#installing-scms)
1. [General concepts](#general-concepts)
1. [Customise site's layout and look & feel](#customise-sites-layout-and-look--feel)
1. [Adding content](#adding-content)
1. [Deploy your site for free on Github Pages]()
1. [API](#api)
   1. [Access your data](#access-your-data)
   1. [MapLeaflet](#mapleaflet)
   1. [MapContainer](#mapcontainer)
   1. [LayersControl](#layerscontrol)
   1. [Vectorlayer](#vectorlayer)
   1. [Rasterlayer and DefaultBaseLayers](#rasterlayer-and-defaultbaselayers)
   1. [Dtable](#dtable)
   1. [Columns](#columns)
   1. [Query Tool](#query-tool)
   1. [Search](#search)
   1. [View Record](#view-record)

## What can I do with s:CMS?
You can setup in few minutes a fully working and secure website containing static pages, with text and images describing your project and also rich data pulled in real time from remote databases and or self-hosted as static files, with which you can build maps, and fully searcheable tables. You are fully enabled to customise the layout and look&feel of your site to perfectly fit your needs.

Think of s:CMS as the *public, fully-customiseable front-end of your research database*

## Preliminary operations
The following preliminary operations are meant to help to be productive *from scratch*. Feel free to skip, if you already have a delevoping-oriented environment based on
- [Node.js](https://nodejs.org/), 
- [Gatsby.js](https://www.gatsbyjs.com/), 
- [Visual Studio Code](https://code.visualstudio.com/) or similar code editors, and
- [Git](https://git-scm.com/) on your computer.

### Installing Visual Studio Code

To download Visual Studio Code, visit the official [web site](https://code.visualstudio.com/) and down the appropriate version for your operating system. VS Code is available for Windows, MacOS, and Linux.

Run the downloaded file and follow the instructions to complete the installation.

### Installing Node.js

There are diffetent ways to install Node.js, depending on your operating system and on your preferences.
An official tutorial is available at [https://nodejs.org/en/learn/getting-started/how-to-install-nodejs](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
1. **Download Node.js**:
   - Go to the official Node.js website: [https://nodejs.org/en/download/prebuilt-installer](https://nodejs.org/en/download/prebuilt-installer)
   - Download the latest stable version (LTS) for your operating system.
2. **Install Node.js**:
   - Run the downloaded file and follow the instructions to complete the installation.
   - During the installation, ensure the option to add Node.js to the PATH environment variable is selected.
3. **Verify the installation**:
   - Open a terminal window or command prompt.
   - Run the command `node -v` to check the installed version of Node.js.
   - Run the command `npm -v` to check the installed version of npm (Node Package Manager).

### Installing Gatsby CLI

- Open a terminal or command prompt.
- Run the command `npm install -g gatsby-cli` to install Gatsby CLI **globally**.
- Run the command `gatsby --version` to ensure Gatsby CLI is installed correctly.

By following these preliminary steps, you'll be ready to start developing with Gatsby JS on your computer.

## Installing sCMS

Now you can create your own s:CMS project!

Just open the terminal or command prompt and type

```bash
npx gatsby new my-new-site https://github.com/lab-archeologia-digitale/sCMS
```
(Make sure to replace `my-new-site` with the name of your own project). 

In the terminal, change the working directory to geet inside your project:
```bash
cd my-new-site
```
and then install all the dependencies of sCMS by running:
```bash
npm i
```
Finally type:
```bash
npm start
```
to start the development server. The site will be served at the URL [http://localhost:8000](http://localhost:8000).

## Edit site's metadata
The main metadata of the site can be changed by editing `gatsby-config.js`. Edit lines 16-19 and add custom values to:
- `siteMetadata.title`: the default title attribute of the site
- `siteMetadata.description`: the default descriprion attribute of the site
- `siteMetadata.author`: the default author attribute of the site
- `siteMetadata.siteUrl`: The URL where the site is available

If is also important to change at line 15: `pathPrefix` to match the relative URL where the site will be published.

This is a very impornt passage, since its misconfiguration might determine wrong paths for internal links.

## Customise site's layout and look & feel

sCMS comes with a default template and a minimum set of example pages. By design, we are not aiming at developing templates: layout and graphics are entirely on your own. Nevertheless sCMS is delivered with a set of tools — such as [React Bootstrap](https://react-bootstrap.github.io/) — that make it easy to write your own templates or customise the default one.

The files responsible for layouting are collected in the `src/layout/` directory.
You can customise the header, the footer, the general layout and stying by editing:
- `header.js`
- `footer.js`
- `layout.js`
- `layout.scss`
- `slide.js`

> **Please note** that you should not edit `layout.css`, `layout.css.map` since this files are being created and updated from the system each time that layout.scss is being updated.


### **layout.js**
   The main structure of the site consists of the layout.js page. On this page, the header and footer of the site are declared and there is the possibility of activating the slide by changing the tag from `{/_ <Slide /> _/}` in `<Slide />`

### **header.js**
   It is possible to change the header graphics by modifying this file. The code to change is the one contained within the <Container> tag. Through html code it is possible to insert divs, images and links.

- div: As for divs you can use bootstrap classes
- images: here is an example of the <staticImage> tag. The images must be contained in the images folder.

```jsx
<StaticImage
  src="../../images/scms-lad.png"
  width={150}
  quality={80}
  formats={["AUTO", "WEBP"]}
  alt={siteTitle}
  className="img-fluid"
/>
```

- link: here is an example of the <Link> tag for the internal page and <a></a> to external links

```jsx
<Link to={"/"}> Something</Link>
```

`<a href="https://github.com/lab-archeologia-digitale/sCMS/issues" target="_blank" rel="noreferrer">Issues</a>`

- style: At the bottom of the page inside the Header constant there is the possibility to add the CSS rules directly

```jsx
const Header = styled.header`
  background-color: #fe04fc;
  color: #ffffff;
  margin-bottom: 5rem;

  .gatsby-image-wrapper {
    background-color: #ffffff;
    img {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`
```

### **footer.js**
   It is possible to change the footer graphics by modifying this file. The code to change is the one contained within the <Container> tag. Through html code it is possible to insert divs, images and links.

- div: As for divs you can use bootstrap classes
- images: here is an example of the <staticImage> tag. The images must be contained in the images folder.

```jsx
<StaticImage
  src="../../images/scms-lad.png"
  width={150}
  quality={80}
  formats={["AUTO", "WEBP"]}
  alt={siteTitle}
  className="img-fluid"
/>
```

- link: here is an example of the <Link> tag for the interal page and <a></a> to external links

```jsx
<Link to={"/"}> Something</Link>
```

`<a href="https://github.com/lab-archeologia-digitale/sCMS/issues" target="_blank" rel="noreferrer">Issues</a>`

- style: At the bottom of the page inside the Footer constant there is the possibility to add the CSS rules directly

```jsx
const Footer = styled.footer`
  background-color: #ececec;
  border-top: #000 solid 0.5rem;
  min-height: auto;
  margin-top: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`
```

### **slide.js**

On the slide page you can edit the StaticImage inside CarouselItems or add a new CarouselItems element. The images also in this case must be saved in the images folder.

### **navbar.js**

To enhance site navigation, a horizontal Navbar has been implemented. On mobile devices, the Navbar becomes vertical and collapsible. This feature automatically collects information on titles and internal positioning from the Front Matter of various pages  (Learn how: [Front Matter](#1-front-matter) ). As the Navbar is built using a React-Bootstrap component, please refer to the official documentation for styling modifications or further implementations: https://react-bootstrap.netlify.app/docs/components/navbar/ 

## Adding content

s:CMS also provide tools for easily build and personalize the pages of your website. Being based on Gatsby, every such page works with the [*.mdx Markdown extension](https://www.gatsbyjs.com/docs/glossary/mdx/#:~:text=MDX%20is%20an%20extension%20to,but%20still%20supports%20inline%20HTML). 

Five example pages are provided in the contents section of the default project that fully explore the potentiality of s:CMS.

### 1. Front Matter

Firstly, it is important that you can configure every page's visualization using metadata that are disposed by default:

| Field           | Required | Example     | Description                                                                 |
|-----------------|----------|-------------|-----------------------------------------------------------------------------|
| `title`           | Y        | homepage  | Define the name shown for the page and on the navbar                        |
| `date`            | N        | 2024-04-10 | Define the date of creation/last update of the page                         |
| `slug`            | Y        | home      | Define the personalized ending of the URL address specific to the page.     |
| `menu_position`   | Y        | 0         | Define the internal indexing of the page used for the correct ordering in the navbar. |

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

---

## API

### Access your data

As previously mentioned, s:CMS is principally designed for the creation of web pages with dynamic content retrieved by an Ajax call from a local CSV or GeoJSON file stored in your project, or a remote database structured in Directus.

For complete documentation on the API system of Directus, see: https://docs.directus.io/reference/introduction.html

For integration of your data into the project, the following props must be used:

| Field     | Type    | Description                                                          |
|-----------|---------|----------------------------------------------------------------------|
| `path2data`  | String  | Relative or full path to the static file containing your data        |
| `dEndPoint` | String  | Full URL pointing to a Directus endpoint, complete with referenced table name |
| `dToken`    | String  | Directus access token, required if the table is not public. If not provided, the `GATSBY_DIRECTUS_TOKEN` environment variable will be used |
| `dTable`    | String  | Directus table containing geographical data. This is an alternative way to point to a Directus table and needs the the `GATSBY_DIRECTUS_TOKEN` environment variable to be set |
| `dQueryString` | String | A string containing the filter to apply to your complete API, already inserted as `dEndPoint` or `dTable` |

The preferred way to point to a Directus database is via environment variables and `dTable` parameter, both for security (it prevents exposure of your credentials) and practicality. Two or more different Directus instances can be referred at the same time, using both methods.

`dQueryString` can also be used for displaying data from different tables linked through relational logic (i.e. define JOINs) or for implementing a limiter (offset) on large databases to facilitate data flow.

For comprehensive documentation, please refer to the official Directus.io API documentation: https://docs.directus.io/reference/introduction.html

### MapLeaflet

This is a component used to vcreate maps using Leaflet.js and it is a wrapper around [`MapContainer`]((https://react-leaflet.js.org/docs/api-map/)) and [`LayersControl`](https://leafletjs.com/reference.html#control-layers) and that contains and manages the graphical display and ordering of the layers. 

**Properties**
- `height`: string, optional, default: "800px"  
   Height (with unit) of the map element.
- `center`: string, optional, default: "0,0,2"  
   Center of the map, as a string with long, lat and zoom separated by commas.
- `baseLayers`: array, optional, default: null.  
   Array with default baselayers to show. One, or many of the following values:
   - "CAWM"
   - "OSM",
   - "EsriSatellite",
   - "EsriStreets",
   - "EsriTopo",
   - "GoogleSatellite",
   - "GoogleRoadmap",
   - "GoogleTerrain",
   - "GoogleAlteredRoadmap",
   - "GoogleTerrainOnly",
   - "GoogleHybrid",
   - "CartoDb",
   - "StamenTerrain",
   - "OSMMapnick",
   - "OSMCycle",
- `scrollWheelZoom`: boolean, optional, default: false.  
   Boolean value that controles whether zoom wheel is active or not.
- `layersControlPosition`: string, optional, default: "topright".  
   Position of the layers control, one of the following values:
   - "topright",
   - "topleft",
   - "bottomright",
   - "bottomleft",

`MapLeaflet` accepts none, one or more `VectorLayer` and/or `RasterLayer` instances as child components


### Vectorlayer

`VectorLayer` is the component that allows you to import, display, and customize your geographical vector data. It must be used as a child of `MapLeaflet` component. A vector layer can be populated with data from different sources, such as:
- a local GeoJSON file
- a remote GeoJSON file
- a table of Directus instance containing geographical data.

**Properties**

- `source`: Object, required, Literal object with information to source data. It is shaped as follows:
  - `path2data`: string, optional (required if `dEndPoint` or `dTable` are not set).  
   Path to GeoJSON data: might be a local path or an URL.
  - `dEndPoint`: string, optional (Required if either dTable (and env GATSBY_DIRECTUS_ENDPOINT) or path2data are not set).  
   Endpoint of a Directus running instance
  - `dTable`: string, optional (required if neither path2data or dEndPoit are set).  
   The table name of a running Directus instance, to be used if the environmental variablea `GATSBY_DIRECTUS_ENDPOINT` is set.
  - `dQueryString`: string, optional.  
   A querystring formatted filter that will be appended to the endpoint to form an API filterDirectus optional filters and other, provided as querystring compatible to Directus API
  - `dToken`: string, optional (required if environmentantal variable `GATSBY_DIRECTUS_TOKEN` is not set)..  
   Access token to accedd the Directus API, if needed.
  - `id`: integer, optional (required if retrieving a record).  
   Id of a specific record to retrieve
  - `transType`: string, optional, of of the following:
    - "text", 
    - "csv2json",
    - "json", 
    - "geojson"

    Tranformation to apply to data retrieved from the api of from the file system
- `name`: string, required.  
   Layer name to use in the Layer control
- `popupTemplate`: string, optional, default: null.  
   A string containing the HTML to render in the popup. Variable propertirs can be used using ${field_name} syntax
- `pointToLayer`: function, optional, default: null.  
   A function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng as properties. The default is to spawn a default Marker. Full reference at https://leafletjs.com/reference.html#geojson-pointtolayer
- `filter`: function, optional, default: null.  
  A function that will be used to decide whether to include a feature or not in the current visualisation. The default is to include all features (no filter applied)
- `checked`: boolean, optional, default: true.  
   Boolean property to control the layer's default visibility ion the map and control panel
- `fitToContent`: boolean, optionbal, default: false
   * Boolean property to decide wether to zoom/pan the map to fit the layer extention or not


(see here: [Access your data](#access-your-data)) to know how correctly setting the path to your data.

##### Rasterlayer and DefaultBaseLayers

These two components manage the raster base of your map. In `DefaultBaseLayers`, each possible source is defined as a prop, which can be added to your `MapLeaflet` Wrapper.

Each declared object has the following attributes:

| Field        | Type   | Required | Description                                          |
|--------------|--------|----------|------------------------------------------------------|
| checked      | string | y        | The name to be displayed on your website.            |
| fitToContent | string | y        | The URL of the tiled map you want to use.            |
| geoField     | string | n        | A string to credit the original creators of the tiled map (necessary for licensed material). |

In the `MapLeaflet` Wrapper, the attributes of each item are used in the `RasterLayer` structure, which also allows you to add the following prop to your layer:

| Field     | Type  | Default | Description                                           |
|-----------|-------|---------|-------------------------------------------------------|
| AsOverlay | bool  | N       | If true, displays the raster layer as an overlay. If false, the layer is treated as a base layer, mutually excluding other base layers. |

#### dtable

A component to display data in a tabular fashion that accepts as arguments data from your database(s) (see how to link your data to your table here: [Access your data](#access-your-data)). The data can also be filtered. It is built on the React Datatable component, supporting all its graphical configurations (https://primereact.org/datatable). An example of these settings is provided below:

| Field    | Type | Default  | Description                                                              |
|----------|------|----------|--------------------------------------------------------------------------|
| striped  | bool | `true`   | If true, visualize alternative rows as striped. See: https://primereact.org/datatable/#striped |

##### Columns

Property of `Dtable` that allows customization of data display within the module. It accepts the following arguments:

| Field    | Type              | Default           | Description                                                                                                    |
|----------|-------------------|-------------------|----------------------------------------------------------------------------------------------------------------|
| name     | string            | `Site_name`       | Define the heading name of your column                                                                         |
| Selector | row               | Accept a function | `row["Site_Name"]` - This property allows access to values associated with a specific key. You can modify and/or concatenate multiple arguments using expressions and variables. IMPORTANT: All data will be automatically rendered as a string. This can be modified via a custom function. See field `Date` in: https://lab-archeologia-digitale.github.io/sCMS/modulo-datatable/ |
| cell     | Accept a function | `image, external link` | Retrieve data from columns with additional customization options for presentation using HTML/React and the ability to implement external links. See fields `item_label` and `thumbnail` in: https://lab-archeologia-digitale.github.io/sCMS/modulo-datatable/ |
| sortable | bool              | `true`            | If true, allows the user to sort data by field`s value initials. See: https://primereact.org/datatable/#sort    |

##### Query Tool

Finally, `Datatb` also includes a custom search tool added to your front end to dynamically modify the displayed data. For backend data filtering see here: [Filtering and join options](#filtering-and-join-options). The attributes of the query tool are:

| Field       | Type         | Default             | Description                                                                 |
|-------------|--------------|---------------------|-----------------------------------------------------------------------------|
| name        | datatype     | `Text`              | Define the type of data for user`s search.                                  |
| className   | CSS styler   | `form-control mb-5` | For graphic customization of the query tool. Accepts existing and/or custom CSS classes. |
| placeholder | Text         | `search…`           | Default value shown in the query tool placeholder.                          |

NB: All data will be automatically rendered as text upon activation of the query.

It is important to note that the tool does not perform case-sensitive searches and scans through all visible fields in the table module. For constructing specific search fields, see [Search](#search).

## Search

The `Search` component shows a double search — both a simple and an advanced one — connected to your data that a user can use to filter them and finally list the results by defining a customised template.

The query can be directed to selected fields using the following prop:


| Parameter   | Required | Type   | Description |
|-------------|----------|--------|-------------|
| `dEndPoint`   |          | string | See above [Access your data](#access-your-data) |
| `dTable`      |          | string | See above [Access your data](#access-your-data) |
| `dToken`      |          | string | See above [Access your data](#access-your-data) |
| `dQueryString` |         | string | See above [Access your data](#access-your-data) |
| `fieldList`   |    Y     | object | Object containing the names of the field that will be available in tha advanced search form. Keys are database name of the fields; values the labels to be shown. In simple search, the query will be limited to these fields |
| `resultItemTemplate` | N | func | Function to be used to show the results. It will receive the object cotaining data about a single item |
| `operators`   |    N     | object | TODO |
| `connector`   |    N     | object | TODO |

For more advanced query logic, see here: [Filtering and join options](#filtering-and-join-options).

For the resulting template, the following arguments are given:

| Field | Type | Default                            | Description                                                   |
|-------|------|------------------------------------|---------------------------------------------------------------|
| key   | id   | {item.id}                          | Necessary element for indexing results. Do not modify.        |
| Item  |      | `item.Item_Label; item.Site_Name`  | Selected fields shown for each element`s template.            |
| <a href=> | URL  | `(`https://inrome.sns.it/db/items/scms_ksa`)}&tb=scms_ksa&token=I0pT7ozY0KuK8i-vtwLQGek36s0IhQ5e&id=${item.id}`}` | A reference linking the `view` button to the item`s record page. Complete endpoint and token must be provided. |

As shown in the [example`s page](https://lab-archeologia-digitale.github.io/sCMS/simple-search/), HTML/CSS syntax can be used for further customisation and organization of the results.

### View Record

A detailed item page that can be linked to your main pages. In its default view, it shows every key-value pair associated with the element in a simple list. It can be personalized via JSX syntax ([JSX Documentation](https://legacy.reactjs.org/docs/introducing-jsx.html)), keeping in mind that:
- `itemEl[0]` represents the key (field`s name);
- `itemEl[1]` represents the associated value for that item.
