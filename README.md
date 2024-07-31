# s:CMS

s:CMS is an easy, open source and ready-to-use content management system useful for generating sites based on Gatsby.js. It also implements data-oriented components for easily connect, display and search your data in maps (WebGis) and/or tables. 

## Preliminary operations

The following preliminary operations are meant to help to be productive from scratch. Feel free to skip, if you have already a delevoping-orineted environment based on node.js, and Gatsby.js on your computer.

### 1. Installing Visual Studio Code (VS Code)

1. **Download Visual Studio Code**:
   - Go to the official Visual Studio Code website: [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download the appropriate version for your operating system (Windows, mMcOS, Linux).
2. **Install Visual Studio Code**:
   - Run the downloaded file and follow the instructions to complete the installation.
3. **Configure Visual Studio Code**:
   - Open VS Code.
   - Install few useful extensions like `Prettier - Code formatter`, `ESLint`, `MDX` and `Gatsby Snippets` via the extensions marketplace.

### 2. Installing Node.js

1. **Download Node.js**:
   - Go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
   - Download the latest stable version (LTS) for your operating system.
2. **Install Node.js**:
   - Run the downloaded file and follow the instructions to complete the installation.
   - During the installation, ensure the option to add Node.js to the PATH environment variable is selected.
3. **Verify the installation**:
   - Open a terminal or command prompt.
   - Run the command `node -v` to check the installed version of Node.js.
   - Run the command `npm -v` to check the installed version of npm (Node Package Manager).

### 3. Installing Gatsby CLI

- Open a terminal or command prompt.
- Run the command `npm install -g gatsby-cli` to install Gatsby CLI **globally**.
- Run the command `gatsby --version` to ensure Gatsby CLI is installed correctly.

By following these preliminary steps, you'll be ready to start developing with Gatsby JS on your computer.

### 4. **Is really that simple?**:

Now you can create your own sCMS project!

Just open the terminal or command prompt and type ‘npx gatsby new my-new-site https://github.com/lab-archeologia-digitale/sCMS’ (replace my-new-site with your project name). 

Then, open the directory of the project using your terminal (cd my-new-site) to access the directory of your new project and the command npm i to install all the dependencies listed in the package.json file of your project and then run the command npm start to start the development server. The site will be opened in a local version, setting by default at the URL http://localhost:8000 (more projects can be simultaneously opened at the same time with different URLs)

## What can I do with SCMS?

	1. **Personalized graphics**(#personalize-sites-layout-and-graphic)
	2. **Create Static pages**(#static-pages)
	3. **Create Static pages with dynamic data**(#pages-with-dynamic-content)
	4. **Create a Web-gis**(#Maps)
	5. **Create full detail pages to fully explore the dataset**(#Record-page)

## PERSONALIZE SITE'S LAYOUT AND GRAPHIC

In the components folder there are the files **to be able to change the site from a graphic point of view**, in particular it is possible to change the header, the footer and add a slide.

- footer.js
- header.js
- index.modules.css
- layout.css
- layout.css.map
- layout.js (MAIN AGE)
- layout.scss
- slide.js
- viewRecord.js

### **layout.js**
   The main structure of the site consists of the layout.js page. On this page, the header and footer of the site are declared and there is the possibility of activating the slide by changing the tag from `{/_ <Slide /> _/}` in `<Slide />`

### **header.js**
   It is possible to change the header graphics by modifying this file. The code to change is the one contained within the <Container> tag. Through html code it is possible to insert divs, images and links.

- div: As for divs you can use bootstrap classes
- images: here is an example of the <staticImage> tag. The images must be contained in the images folder.

```javascript
<StaticImage
  src="../images/scms-lad.png"
  width={150}
  quality={80}
  formats={["AUTO", "WEBP"]}
  alt={siteTitle}
  className="img-fluid"
/>
```

- link: here is an example of the <Link> tag for the interal page and <a></a> to external links

```javascript
<Link to={withPrefix("/")}> Somethings </Link>
```

`<a href="https://github.com/lab-archeologia-digitale/gatsby-directus-ui/issues" target="_blank" rel="noreferrer">Issues</a>`

- style: At the bottom of the page inside the Header constant there is the possibility to add the CSS rules directly

```javascript
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

```javascript
<StaticImage
  src="../images/scms-lad.png"
  width={150}
  quality={80}
  formats={["AUTO", "WEBP"]}
  alt={siteTitle}
  className="img-fluid"
/>
```

- link: here is an example of the <Link> tag for the interal page and <a></a> to external links

```javascript
<Link to={withPrefix("/")}> Somethings </Link>
```

`<a href="https://github.com/lab-archeologia-digitale/gatsby-directus-ui/issues" target="_blank" rel="noreferrer">Issues</a>`

- style: At the bottom of the page inside the Footer constant there is the possibility to add the CSS rules directly

```javascript
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

## Pages

Scms also provide tools for easily build and personalize the pages of your website. Being based on Gatsby, every such page works with the .mdx Markdown extension [MDX documentation](https://www.gatsbyjs.com/docs/glossary/mdx/#:~:text=MDX%20is%20an%20extension%20to,but%20still%20supports%20inline%20HTML). 

Five example pages are provided in the contents section of the default project that fully explore the potentiality of Scms.

### 1. Front Matter

Firstly, it is important that you can configure every page’s visualization using metadata that are disposed by default:

| Field           | Required | Example     | Description                                                                 |
|-----------------|----------|-------------|-----------------------------------------------------------------------------|
| title           | Y        | ‘homepage’  | Define the name shown for the page and on the navbar                        |
| date            | N        | ‘2024-04-10’| Define the date of creation/last update of the page                         |
| slug            | Y        | ‘home’      | Define the personalized ending of the URL address specific to the page.     |
| menu_position   | Y        | ‘0’         | Define the internal indexing of the page used for the correct ordering in the navbar. |

### 2. Static page

As the most basic unit of your website, you can add one or more static pages integrating text, links, and images. The MDX structure permits you to easily use Markdown and HTML syntax, and also allows you to integrate static query components to further personalize your page.

### 3. Pages with dynamic content:

Scms provides you a full arrangement of features for building pages integrating static content (text, images, links) with dynamic data (accessed by an Ajax call) taken from a relational database. The system is optimized for online databases managed by Directus, but local access can also be used.

#### 3.1. Maps

Scms gives you the chance to build a web-GIS map composed by the juxtaposition of Raster and Vector layers. Various tools are provided for helping customize both the graphical rendering of the wrapper and the visualization of the content.

For the RASTER bases, a simplified access to the most common providers of satellite imagery and digital maps is provided by default, with the possibility to extend the selection to custom maps. Tools are also provided for full customization of vector layers, from data filtering to icon customization. For more complex projects, a layer selector is provided to allow users a cleaner data visualization.

(learn how: [MyMap](#mymap))

#### 3.2. Table

You can also add a table to organically show your data in an intuitive format! The table component provides options for a front-end general filter. With various graphical configuration options, the presentation of data can be customized to fit the specific needs of the project. Additionally, you can choose which fields to display and customize how they are presented, adding external and/or internal links or preview images that mirror outside sources.

(Learn how: [Dtable](#dtable))

#### 3.3. Search page

Enhance the navigation of your data by adding a query page. This easily customizable tool supports various query logics and result presentations, allowing you to select which fields are searchable and how the results are displayed. You can also include links to external resources, internal pages, or even previews of content.

(Learn how: [Search](#search))

#### 3.4. Record page

A page that displays an item's details in a simple list format and can be customized to fit your needs. The record page can be accessed only through direct links from other pages on the site, providing a comprehensive view of complex information and allowing for detailed exploration that may not be fully covered in summary pages.

(Learn how: [View Record](#view-record))

## Pubblicazione sito su GitHub Pages

`Documentation to be completed`

## API

### Premises

#### Access to your data

As previously mentioned, Scms is principally designed for the creation of web pages with dynamic content retrieved by an Ajax call from a local CSV or GeoJSON file stored in your project, or a remote database structured in Directus.

For complete documentation on the API system of Directus, see: https://docs.directus.io/reference/introduction.html

For integration of your data into the project, the following props must be used:

| Field     | Source          | Description                                                          |
|-----------|-----------------|----------------------------------------------------------------------|
| path2cvs  | local           | relative or full path to a CSV file to use for the data Table creation |
| dEndPoint | Directus table  | full path to a Directus endpoint, complete with table name            |
| dToken    | Directus table  | Directus access token, required if the table is not public. If not provided, the `GATSBY_DIRECTUS_TOKEN` environment variable will be used |

Additionally, it is possible to include an `.env` file in your project to store the default endpoint and token of your Directus database. In this case, you will only need the following prop:

| Field   | Source         | Description                                        |
|---------|----------------|----------------------------------------------------|
| DTable  | Directus table | name of the Directus table containing geographical data |

This approach should be preferred for both security (it prevents exposure of your credentials) and practicality. Two Directus databases can be linked at the same time, using both methods.

#### Filtering and join options

Tutti gli URL Directus implementano pienamente l'API Directus via `dQueryString`.

All filtering options are applicable in the backend, following the GraphQL logic implemented by Directus. These can be applied to your full API call (`dEndPoint`/`DTable`) or using the following Scms’ Prop:

| Field         | Source         | Description                                                          |
|---------------|----------------|----------------------------------------------------------------------|
| dQueryString  | Directus table | A string containing the filter to apply to your complete API, already inserted as `dEndPoint` or `DTable` |

For an example, see: https://lab-archeologia-digitale.github.io/sCMS/modulo-mappa/

This tool is also necessary for displaying data from different tables linked through relational logic or for implementing a limiter (offset) on large databases to facilitate data flow.

For comprehensive documentation, please refer to the official Directus page on the matter: https://docs.directus.io/reference/introduction.html

### Modules

#### MyMap

Element that imports the components useful for rendering your Maps. These components are:

##### MapComp

The wrapper that contains and manages the graphical display and ordering of the layers. It is built on React components `MapContainer` (https://react-leaflet.js.org/docs/api-map/) and `LayersControl` (https://leafletjs.com/reference.html#control-layers).

It accepts `VectorLayer` and `RasterLayer` as children.

##### MapContainer

It accepts the following props:

| Field           | Type              | Default    | Description                                                                   |
|-----------------|-------------------|------------|-------------------------------------------------------------------------------|
| height          | string            | ‘600 px’   | Defines the height of the map, expressed in pixels.                           |
| scrollWheelZoom | bool              | ‘false’    | If true, enables the user's ability to zoom the map using the scroll wheel    |
| center          | Coordinates (lng, lat) | ‘0,0’ (undefined) | Defines the starting coordinates of the map. If incorrect, center auto-adjusts to the bounding box of vector layers. |
| zoom            | int               | ‘2’        | Defines the initial zoom level of the map.                                    |

##### LayersControl

It accepts the following props:

| Field      | Type   | Default  | Description                                                                  |
|------------|--------|----------|------------------------------------------------------------------------------|
| position   | string | ‘topright’| Specifies the position of the control panel. For more details, see: Leaflet Control Layers Documentation. |
| baseLayers | string | ‘OSM’    | Determines the base Raster Layers to use on the map. Separate multiple maps with commas. |

##### Vectorlayer

`VectorLayer` is the component that allows you to import, display, and customize your geographical data. It defines the following props:

| Field         | Type                | Default       | Description                                                                  |
|---------------|---------------------|---------------|------------------------------------------------------------------------------|
| name          | string              |               | Specifies the name of the layer as it appears in the LayersControl tool.      |
| popupTemplate | Accepts other props |               | A custom popup template for viewing geographical objects' attributes. Can include fields from your project. |
| Filter        |                     | ‘True’        | A comment that indicates a filter or setting                                 |
| pointToLayer  | bool                | CircleMarker  | Function defining how to display point features. See: https://leafletjs.com/reference.html#circlemarker |
| checked       | bool                | ‘True’        | If true, the layer is displayed by default on the map.                       |
| fitToContent  | bool                | ‘True’        | If true, adjusts the map's view to fit the bounds of the current layer.      |
| geoField      | LatLng              | ‘coordinates’ | Specifies the geographical field of your data in LatLng format.              |

(see here: [Access to your data](#access-to-your-data)) to know how correctly setting the path to your data.

##### Rasterlayer and DefaultBaseLayers

These two components manage the raster base of your map. In `DefaultBaseLayers`, each possible source is defined as a prop, which can be added to your `MapComp` Wrapper.

Each declared object has the following attributes:

| Field        | Type   | Required | Description                                          |
|--------------|--------|----------|------------------------------------------------------|
| checked      | string | y        | The name to be displayed on your website.            |
| fitToContent | string | y        | The URL of the tiled map you want to use.            |
| geoField     | string | n        | A string to credit the original creators of the tiled map (necessary for licensed material). |

In the `MapComp` Wrapper, the attributes of each item are used in the `RasterLayer` structure, which also allows you to add the following prop to your layer:

| Field     | Type  | Default | Description                                           |
|-----------|-------|---------|-------------------------------------------------------|
| AsOverlay | bool  | N       | If true, displays the raster layer as an overlay. If false, the layer is treated as a base layer, mutually excluding other base layers. |

#### Dtable

A component to display data in a tabular fashion that accepts as arguments data from your database(s) (see how to link your data to your table here: [Access to your data](#access-to-your-data)). The data can also be filtered. It is built on the React Datatable component, supporting all its graphical configurations (https://primereact.org/datatable). An example of these settings is provided below:

| Field    | Type | Default  | Description                                                              |
|----------|------|----------|--------------------------------------------------------------------------|
| striped  | bool | ‘true’   | If true, visualize alternative rows as striped. See: https://primereact.org/datatable/#striped |

##### Columns

Property of `Dtable` that allows customization of data display within the module. It accepts the following arguments:

| Field    | Type              | Default           | Description                                                                                                    |
|----------|-------------------|-------------------|----------------------------------------------------------------------------------------------------------------|
| name     | string            | ‘Site_name’       | Define the heading name of your column                                                                         |
| Selector | row               | Accept a function | ‘row["Site_Name"]’ - This property allows access to values associated with a specific key. You can modify and/or concatenate multiple arguments using expressions and variables. IMPORTANT: All data will be automatically rendered as a string. This can be modified via a custom function. See field ‘Date’ in: https://lab-archeologia-digitale.github.io/sCMS/modulo-datatable/ |
| cell     | Accept a function | ‘image, external link’ | Retrieve data from columns with additional customization options for presentation using HTML/React and the ability to implement external links. See fields ‘item_label’ and ‘thumbnail’ in: https://lab-archeologia-digitale.github.io/sCMS/modulo-datatable/ |
| sortable | bool              | ‘true’            | If true, allows the user to sort data by field’s value initials. See: https://primereact.org/datatable/#sort    |

##### Query Tool

Finally, `Datatb` also includes a custom search tool added to your front end to dynamically modify the displayed data. For backend data filtering see here: [Filtering and join options](#filtering-and-join-options). The attributes of the query tool are:

| Field       | Type         | Default             | Description                                                                 |
|-------------|--------------|---------------------|-----------------------------------------------------------------------------|
| name        | datatype     | ‘Text’              | Define the type of data for user’s search.                                  |
| className   | CSS styler   | ‘form-control mb-5’ | For graphic customization of the query tool. Accepts existing and/or custom CSS classes. |
| placeholder | Text         | ‘search…’           | Default value shown in the query tool placeholder.                          |

NB: All data will be automatically rendered as text upon activation of the query.

It is important to note that the tool does not perform case-sensitive searches and scans through all visible fields in the table module. For constructing specific search fields, see [Search](#search).

### Search

A `Search` component connects to your data, allowing customization of the query logic and the display of results. It consists of a query field for entering text, a button to handle the query, and a template that individually shows each object that satisfies the query.

The query can be directed to selected fields using the following prop:

| Field       | Type   | Default                                  | Description                                                      |
|-------------|--------|------------------------------------------|------------------------------------------------------------------|
| searchFields | string | ‘Item_Label,Site_Name,Site_Description’ | Names of fields to be queried. In the case of a multiple-field query, separate the names with commas. |

For more advanced query logic, see here: [Filtering and join options](#filtering-and-join-options).

For the resulting template, the following arguments are given:

| Field | Type | Default                            | Description                                                   |
|-------|------|------------------------------------|---------------------------------------------------------------|
| key   | id   | {item.id}                          | Necessary element for indexing results. Do not modify.        |
| Item  |      | ‘item.Item_Label ; item.Site_Name’ | Selected fields shown for each element’s template.            |
| <a href=> | URL  | ‘(`https://inrome.sns.it/db/items/cms_articles`)}&tb=cms_articles&token=I0pT7ozY0KuK8i-vtwLQGek36s0IhQ5e&id=${item.id}`}’ | A reference linking the ‘view’ button to the item’s record page. Complete endpoint and token must be provided. |

As shown in the [example’s page](https://lab-archeologia-digitale.github.io/sCMS/simple-search/), HTML/CSS syntax can be used for further personalization and organization of the results.

### View Record

A detailed item page that can be linked to your main pages. In its default view, it shows every key-value pair associated with the element in a simple list. It can be personalized via JSX syntax ([JSX Documentation](https://legacy.reactjs.org/docs/introducing-jsx.html)), keeping in mind that:
- `itemEl[0]` represents the key (field’s name);
- `itemEl[1]` represents the associated value for that item.
