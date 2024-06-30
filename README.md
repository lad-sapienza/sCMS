# s:CMS

`s:CMS` is an easy to use content management system to generate static sites.
It is based on Gatsby and implements some data-oriented complements for connecting to remote databases and display maps and tables.

## PRELIMINARY OPERATIONS

Here are the preliminary steps to start working with Gatsby JS on your PC:

### 1. Installing Visual Studio Code (VS Code)

1. **Download Visual Studio Code**:
   - Go to the official Visual Studio Code website: [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download the appropriate version for your operating system (Windows, macOS, Linux).
2. **Install Visual Studio Code**:
   - Run the downloaded file and follow the instructions to complete the installation.
3. **Configure Visual Studio Code**:
   - Open VS Code.
   - Install useful extensions like "Prettier - Code formatter", "ESLint", "MDX" and "Gatsby Snippets" via the extensions marketplace.

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
- Run the command `npm install -g gatsby-cli` to install Gatsby CLI globally.
- Run the command `gatsby --version` to ensure Gatsby CLI is installed correctly.

By following these preliminary steps, you'll be ready to start developing with Gatsby JS on your PC.

## CREATING A NEW GTSBY PROJECT

1. **Create a new Gatsby project**:

- Run the command `npx gatsby new my-new-site https://github.com/lab-archeologia-digitale/sCMS` in the terminal replacing `my-new-site` with your desired project name.
- This command will create a new folder with the specified name and download the necessary example files.

2. **Navigate to the project folder**:

- Run the command `cd my-new-site` to enter the directory of your new project.
- Run the command `npm i` Installs all the dependencies listed in the package.json file of your project.
- Run the command `npm start` Starts the development server
- Once started, the project will be available at `http://localhost:8000`.

## EDITING THE PROJECT WITH VISUAL STUDIO CODE

- Open Visual Studio Code.
- Select `File` > `Open Folder` and navigate to your Gatsby project folder.
- Use VS Code to edit the files of your Gatsby project and see the changes in real-time thanks to the development server.

## TABLE OF CONTENT

- COMPONENTS
- CONTENTS
- IMAGES
- MODULES
- PAGES
- SERVICES
- TEMPLATES

This is the list of contents of the Gatsby project. To modify the example site the user will have to intervene in particular in the files contained in the first three folders (Components, Contents and Images).

### COMPONENTS

In the components folder there are the files to be able to change the site from a graphic point of view, in particular it is possible to change the header, the footer and add a slide.

- footer.js
- header.js
- index.modules.css
- layout.css
- layout.css.map
- layout.js (MAIN PAGE)
- layout.scss
- slide.js
- viewRecord.js

1. **layout.js**
   The main structure of the site consists of the layout.js page. On this page, the header and footer of the site are declared and there is the possibility of activating the slide by changing the tag from {/_ <Slide /> _/} in <Slide />
2. **header.js**
   It is possible to change the header graphics by modifying this file. The code to change is the one contained within the <Container> tag. Through html code it is possible to insert divs, images and links.

- div: As for divs you can use bootstrap classes
- images: here is an example of the <staticImage> tag. The images must be contained in the images folder.
  `<StaticImage
      src="../images/scms-lad.png"
      width={150}
      quality={80}
      formats={["AUTO", "WEBP"]}
      alt={siteTitle}
      className="img-fluid"
    />`
- link: here is an example of the <Link> tag for the interal page and <a></a> to external links

`<Link to={withPrefix("/")}> Somethings </Link>`
`<a href="https://github.com/lab-archeologia-digitale/gatsby-directus-ui/issues" target="_blank" rel="noreferrer">Issues</a>`

3. **footer.js**
   It is possible to change the footer graphics by modifying this file. The code to change is the one contained within the <Container> tag. Through html code it is possible to insert divs, images and links.

- div: As for divs you can use bootstrap classes
- images: here is an example of the <staticImage> tag. The images must be contained in the images folder.
  `<StaticImage
      src="../images/scms-lad.png"
      width={150}
      quality={80}
      formats={["AUTO", "WEBP"]}
      alt={siteTitle}
      className="img-fluid"
    />`
- link: here is an example of the <Link> tag for the interal page and <a></a> to external links

`<Link to={withPrefix("/")}> Somethings </Link>`
`<a href="https://github.com/lab-archeologia-digitale/gatsby-directus-ui/issues" target="_blank" rel="noreferrer">Issues</a>`

4. **slide.js**

`Documentation to be completed`

# Maplibre
