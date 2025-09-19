# vite-plugin-wp-component

A **Vite plugin + CLI** for creating, configuring, and deploying WordPress components as reusable plugins.

It allows you to:

- Manage FTP credentials and component metadata.
- Automatically generate the PHP file that registers your component as a WordPress plugin.
- Expose the component configuration as a global variable (`__COMPONENT_CONFIG__`).
- Render your component inside a unique `rootID`, consistent across development and production.
- Deploy directly to your WordPress plugins folder via **FTP**.

## Installation

The recommended way to start is by using **[`wp-create-component`](https://www.npmjs.com/package/wp-create-component)**.  
This CLI scaffolds a new project with:

- A preconfigured `vite.config.js`
- `postcss.config.js`
- A demo component template showing how the workflow works
- All required project structure

```
npx wp-create-component
```

This is the fastest way to get started and ensures your setup follows the expected structure.

---

### Manual installation

If you prefer to add the plugin manually to an existing Vite project, you can install it via npm:

```
npm install vite-plugin-wp-component --save-dev
```

Once installed you can run `wp-component init`

## CLI

The package installs the `wp-component` command with three main subcommands:

### 1\. `wp-component init`

Creates all the necessary files and structure for the plugin to work:

- Prompts to generate a `component.config.json` file.
- Creates a `.env` file with empty fields (must be later configured using `wp-component config`).
- Creates a `wp-plugin/` directory where the PHP file will be generated.
- Generates a `vite.config.js` file preconfigured with the expected **build settings** and the Vite plugin already set up.
- Generates a `postcss.config.js` file with default settings.

### 2\. `wp-component config`

Opens an interactive selector that allows you to:

- Edit the `.env` file with FTP credentials.
- Edit the `component.config.json` file with your component metadata.

### 3\. `wp-component build`

Generates the WordPress plugin PHP file from a template, injecting values from `component.config.json`.

- The generated file is saved inside the `wp-plugin/` folder.

### 4\. `wp-component deploy`

Reads credentials from `.env` and deploys the plugin via **BasicFTP** to your WordPress installation.

## Configuration

You can edit the following files directly or usin the CLI utility.

### `.env`

You need an `.env` file with your FTP credentials:

```
# FTP Credentials
FTP_HOST=ftp.mydomain.com
FTP_USER=username
FTP_PASSWORD=password
FTP_REMOTE_DIR=/public_html/wp-content/plugins
```

⚠️ **Important**:
`FTP_REMOTE_DIR` must point **directly to the WordPress plugins folder**.

---

### `component.config.json`

This file defines your component metadata:

```
{
"name": "My Component",			// Name displayed in the WP plugins list
"description": "Description",	// Description displayed in WP
"author": "Your Name",			// Author name shown in WP
"slug": "my-component",			// Unique slug, also used to generate the shortcode [my-component]
"_hash": "abc123"				// Auto-regenerated whenever config is edited via CLI, used to generate the rootID.
}
```

## Vite Plugin

In your `vite.config.js` you can register the plugin:

```
import wpComponentPlugin from "vite-plugin-wp-component";

export default {   plugins: [wpComponentPlugin()], };
```

### What does the plugin do?

- Reads configuration from `component.config.json`.
- Exposes the metadata as a global variable:

`__COMPONENT_CONFIG__ // full object with component configuration`

- Dynamically adds a `.rootID` field generated from:

`slug + _hash`

## Using the `rootID`

- In **development** (`vite dev`), the `rootID` is used in `index.html` as the ID of the root element where your component is mounted.
- In **production**, the WordPress shortcode creates an element with the same `rootID`.

It is **critical** to use `__COMPONENT_CONFIG__.rootID` so that both dev and production environments share the exact same element ID.

Example in `index.html`:

```
<div id="__COMPONENT_CONFIG__.rootID"></div>
```

Example in your JS code:

```
const root = document.getElementById(__COMPONENT_CONFIG__.rootID); // Mount your app/framework here
```

## Typical Workflow

1.  Configure credentials and metadata:

    ```
    wp-component config
    ```

2.  Generate the WordPress plugin PHP file:

    ```
    wp-component build
    ```

3.  Deploy to WordPress via FTP:

    ```
    wp-component deploy
    ```
