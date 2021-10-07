---
sidebar_position: 1
---

# Sandpack examples


## Single file

````js sandpack
export default function App() {
  return <p>Hello Docusaurus</p>;
}
````

## Multiples files

````js sandpack template=react theme=codesandbox-dark
```js file=/App.js
import "./style.css"

export default function App() {
  return <p>Hello Docusaurus</p>;
}
```
```css file=/style.css
body {
  background: red;
}
```;
````

## Theme: GitHub Light

````js sandpack theme=github-light
export default function App() {
  return <p>Hello Docusaurus</p>;
}
````

## Getting Started

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

## Generate a new site

Generate a new Docusaurus site using the **classic template**:

```shell
npx @docusaurus/init@latest init my-website classic
```

## Start your site

Run the development server:

```shell
cd my-website

npx docusaurus start
```

Your site starts at `http://localhost:3000`.

Open `docs/intro.md` and edit some lines: the site **reloads automatically** and display your changes.
