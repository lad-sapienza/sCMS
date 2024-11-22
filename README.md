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
   1. [Access data from components](#access-data-from-components)
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

### Access data from components

Most of the S:CMS componens have a unified interface to access data stored in local/remote files or on a Directus instance. Thi interface also implements some default basic data transformation services. These parameters are collected in a literal object names `source` that can be provided to the single components.

The `source` object must follow the following shape:

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `path2data` | string | no (required if `dEndPoint` or `dTable` are not set) | _null_ | Path to static file of structured data (JSON, GeoJSON, CSV, etc.): might be a local, relative path or an URL. |
| `dEndPoint` | string | no (required if either `path2data` nor environmental variable `GATSBY_DIRECTUS_ENDPOINT` or are not set) | _null_ | Full URL of the API endpoint of a Directus running instance. |
| `dTable` | string | no (required if `dEndPoit` or `GATSBY_DIRECTUS_ENDPOINT` are set). | _null_ | The table name of a running Directus instance. |
| `dToken` | string | no (required if environmentantal variable `GATSBY_DIRECTUS_TOKEN` is not set and the Directus API requires authentication) | _null_ | Access token to accedd the Directus API, if needed. |
| `dQueryString` | string | no | _null_ | A query-string formatted filter that will be appended to the endpoint to form an API filter for the data. |
| `id` | integer | no (required if retrieving a record) | _null_ | Id of a specific record to retrieve. |
| `transType` | string | no | "geojson" | Tranformation to apply to data retrieved from the api of from the file system. One of the following values can be used: "text", "csv2json", "json", "geojson". |

s:CMS provides a way to define a default Directus API data source as [environment variables](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/). In development, Gatsby will load environment variables from a file named `.env.development`. For builds, it will load from `.env.production`. If you are using GitHub Pages as a deployment platform, you can use [secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions). s:CMS handles automatically the following environmental variables:

- `GATSBY_DIRECTUS_ENDPOINT`: a replacement of the parameter `source.dEndPoint`
- `GATSBY_DIRECTUS_TOKEN`: a replacements of the paramater `source.dToken`

### MapLeaflet

The `MapLeaflet` component is used to create maps using Leaflet.js and it is a wrapper around [`MapContainer`](https://react-leaflet.js.org/docs/api-map/) module.

**Props**

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `height` | string | no | "800px" | Height (with unit) of the map element. |
| `center` | string | no | "0,0,2" | Center of the map, as a string with long, lat and zoom separated by commas. |
| `baseLayers` | array | no | _null_ | Array with default baselayers to show. One, or many of the following values: "CAWM" "OSM", "EsriSatellite", "EsriStreets", "EsriTopo", "GoogleSatellite", "GoogleRoadmap", "GoogleTerrain", "GoogleAlteredRoadmap", "GoogleTerrainOnly", "GoogleHybrid", "CartoDb", "StamenTerrain", "OSMMapnick", "OSMCycle". |
| `scrollWheelZoom` | boolean | no | _false_ | Boolean value that controles whether zoom wheel is active or not. |
| `layersControlPosition` | string | no | "topright" | Position of the layers control, one of the following values: "topright", "topleft", "bottomright" "bottomleft". |

`MapLeaflet` accepts none, one or more `VectorLayer` and/or `RasterLayer` instances as child components


### VectorLayer

The `VectorLayer` component can be used to import, display, and customize your geographical vector data in the map. It must be used as a child of `MapLeaflet` component. A vector layer can be populated with data from different sources, such as:
- a local GeoJSON file
- a remote GeoJSON file
- a table of Directus instance containing geographical data.

**Props**

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `source` | object | yes |  | For the complete documentation: [Access data from components](#access-data-from-components). |
| `name` | string | yes |  | Layer name to use in the Layer control |
| `popupTemplate` | string | no | _null_ | A string containing the HTML to render in the popup. Variable propertirs can be used using ${field_name} syntax. |
| `pointToLayer` | function | no | _null_ | A function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng as properties. The default is to spawn a default Marker. Full reference at https://leafletjs.com/reference.html#geojson-pointtolayer. |
| `filter` | function | no | _null_ | A function that will be used to decide whether to include a feature or not in the current visualisation. The default is to include all features (no filter applied). |
| `checked` | boolean | no | true | Boolean property to control the layer's default visibility ion the map and control panel |
| `fitToContent` | boolean | no | _false_ | Boolean property to decide wether to zoom/pan the map to fit the layer extention or not. |


### RasterLayer

The `RasterLayer` components can be used to import and display raster tiles in the map. It must be used as a child of `MapLeaflet` component.
 

**Props**

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `name` | string | yes | _null_ | Name of the baselayer to show in Layer control|
| `url` | string | yes | _null_ | URL where raster tiles are found. |
| `checked` | boolean | no | _false_ | Property to control the layer's default visibility ion the map and control panel. |
| `attribution` | string | no | _null_ | Attribution or credits for the layer. |
| `asOverlay` | boolean | no | _false_ | If true the layer will be listed in the Overlay list; if false (default) in the base-layers list. |


### MapLibre

The `MapLibre` component is used to create maps using MapLibre and it is a wrapper around [`react-map-gl`](https://visgl.github.io/react-map-gl/) module. It aims to be a full replacement of the MapLeaflet, by maintaining the same API and possibly providing enhanced functionality, mainly related to the native support for vector tiles.

**Props**

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `height` | string | no | "800px" | Height (with unit) of the map element. |
| `center` | string | no | "0,0,2" | Center of the map, as a string with long, lat and zoom separated by commas. |
| `baseLayers` | array | no | _null_ | Array with default baselayers to show. One, or many of the following values: "CAWM" "OSM", "EsriSatellite", "EsriStreets", "EsriTopo", "GoogleSatellite", "GoogleRoadmap", "GoogleTerrain", "GoogleAlteredRoadmap", "GoogleTerrainOnly", "GoogleHybrid", "CartoDb", "StamenTerrain", "OSMMapnick", "OSMCycle". |
| `scrollWheelZoom` | boolean | no | _false_ | Boolean value that controles whether zoom wheel is active or not. |
| `layersControlPosition` | string | no | "topright" | Position of the layers control, one of the following values: "topright", "topleft", "bottomright" "bottomleft". |

`MapLeaflet` accepts none, one or more `VectorLayer` and/or `RasterLayer` instances as child components

### VectorLayerLibre

The `VectorLayerLibre` component is a React component that renders a vector layer on a map using GeoJSON data. It manages the layer's style, visibility, and data fetching.

**Props**

| Prop | Type | Required | Default value | Description |
|---|---|---|---|---|
| `source` | Object | Yes | _null_ | Data source for the GeoJSON. For the complete documentation: [Access data from components](#access-data-from-components).  |
| `refId` | string | No | _null_ | Reference ID for the layer, as defined in the external styles.json file. It is used to oveerride the layer name / style / popup etc. |
| `style` | Object | No | _null_ | Style configuration for the layer. For the complete documentation see: [https://maplibre.org/maplibre-style-spec/layers/](https://maplibre.org/maplibre-style-spec/layers/)|
| `name` | string | Yes | _null_ | Layer name to use in the Layer control. |
| `searchInFields` | Array | No | _null_ | Array containing field that will be exposed to the search interface. If missing the layer will NOT be searcheable. |
| `fitToContent` | boolean | No | false | Whether to fit the map to the content. |
| `checked` | boolean | No | false | Whether the layer is checked/visible. |
| `popupTemplate` | string | No | _null_ | A string containing the HTML to render in the popup. Variable props can be injected using ${field_name} syntax. |

  

### RasterLayerLibre

The `RasterLayerLibre` component is designed to render a raster layer on a MapLibre map. This documentation provides an overview of the component and its props.

**Props**


| Prop | Type | Required | Default value | Description |
|---|---|---|---|---|
| `name` | string | Yes | _null_ | The name of the layer to be displayed in the Control Panel. |
| `url` | string \| string[] | Yes |  _null_ | The URL(s) of the raster tiles. Can be a single string or an array of strings. |
| `checked` | boolean | Yes |  false | Determines if the layer is visible or not. If true, the layer is displayed. |
| `attribution` | string | No |  _null_ |Optional attribution or credits for the layer. |


### DataTb

The `DataTb` component displays data ordered in a two-dimensional table. It can be populated with data from a Directud API endpoint, a static CSV or JSON files hosted locally or in the WWW. Under the hood DataTb uses the [React Data Table Component](https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs) and supports out of the box all configurations and settings described on the [official documentation](https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs). An example of these settings is provided below:

**Props**

| Prop Name | Type | Required | Default value | Description |
|----------|------|-------------------|---------------|-------------|
| `source` | object | yes |  _null_ | For the complete documentation: [Access data from components](#access-data-from-components). |
| `columns` | object | yes | _null_ | Object containing information on the columns of the table. The full documentation is available in the [official documentation](https://react-data-table-component.netlify.app/?path=/docs/api-columns--docs)|
| `...props` |  |  |  | All parameters described in the [official React Data Table Component documentation](https://react-data-table-component.netlify.app/?path=/docs/api-props--docs) can be used with this component. |



## Search

The `Search` component is a React component that provides a user interface for searching data from a specified source. It allows users to input search criteria and displays the results based on a provided template.

**Props**


| Prop Name | Type | Required | Default value | Description |
| --- |--- | --- | --- | --- |
| `source` | Object | Yes | _null_ | An object containing information to source data. This should include the necessary properties for querying the data source. [More info on source object](#access-data-from-components)|
| `resultItemTemplate`| Function | Yes | _null_ | A template function to render each result item. This function receives an item from the search results and should return a React element. |
| `fieldList` | Object | Yes | _null_ | An object defining the fields available for querying. |
| `operators` | Object | No | <pre lang="json">{<br> "_eq": "Equals",<br> "_neq": "Doesn't equal",<br> "_lt": "Less  than",<br> "_lte": "Less than or equal to",<br> "_gt": "Greater than",<br> "_gte": "Greater than or equal to",<br> "_null": "Is null",<br> "_nnull": "Isn't null",<br> "_contains": "Contains",<br> "_icontains": "Contains (case-insensitive)",<br> "_ncontains": "Doesn't contain",<br> "_starts_with": "Starts with",<br> "_istarts_with": "Starts with (case-insensitive)",<br> "_nstarts_with": "Doesn't start with",<br> "_nistarts_with": "Doesn't start with (case-insensitive)",<br> "_ends_with": "Ends with",<br> "_iends_with": "Ends with (case-insensitive)",<br> "_nends_with": "Doesn't end with",<br> "_niends_with": "Doesn't end with (case-insensitive)",<br> "_empty": "Is empty",<br> "_nempty": "Isn't empty"<br> }</pre> | An object containing the identifiers of the operators (keys) and the labels to use for the UI. This can be used to overwrite default options, for example, to have the UI translated in a different language. |
| `connector` | Object | No | <pre lang="json">{<br> "_and": "AND",<br> "_or": "OR"<br>}</pre> | An object containing the logical connectors (keys) and the labels to use for the UI. This can be used to overwrite the default value, for example, to have the UI translated in a different language. |




### Record

The `Record` component is a React component that fetches and provides record data based on specified search parameters. It handles loading and error states and renders its children once the data is available. The component utilizes the React Context API to provide the fetched record data to its descendants.

**Props**
| Prop Name | Type | Required | Default value | Description |
|---|---|----|---|---|
| `search` | Object | Yes | _null_ | An object containing the search parameters. |
| `search.tb` | string | YES | _null_ | The name of the Directus table to fetch data from. |
| `search.endPoint` | string | No if env variable `dEndPoint` is set | _null_ | The Directus endpoint to fetch data from. |
| `search.token` | string | No if env variable `dToken` is set | The Directus token for authentication (optional). |
| `search.id` | string | Yes | _null_ | The ID of the record to fetch. |
| `children`| ReactNode | Yes | _null_ | Child components to render once the data is fetched. `Field` component can be used to show data for specific field. |


### Field

The `Field` component is a React component that retrieves and displays data from the `Record`. It allows for optional transformation of the data before rendering.


**Props**
| Prop Name | Type | Required | Default value | Description |
|---|---|----|---|---|
| `name` | Array<string> | Yes | _null_ | An array of strings representing the keys or indices of the data to retrieve. <br> Example: <br> If the data is {"one": "One Value", "two": ["Two value #1", "Two value 2"]}, then name: ["one"] will return "One Value" and name: ["two", "1"] will return "Two value 2". |
| `transformer` | Function (optional) | No | `JSON.stringify`, if data is not a string | A function that receives the retrieved data as input and performs transformation or any other type of logic. <br> Example: You can use this to loop through an array of child data. <br> If not provided, the component will use JSON.stringify on non-string data. |