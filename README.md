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

- footer.js
- header.js
- index.modules.css
- layout.css
- layout.css.map
- layout.js
- layout.scss
- slide.js
- viewRecord.js

`Documentation to be completed`

# Maplibre
