---
sidebar_position: 1
---

# Introduction

React components that give you the power of editable sandboxes that run in the
browser. Powered by `Sandpack`, the online bundler used by
[CodeSandbox](https://codesandbox.io/).

Sandpack is an open ecosystem of components and utilities that allow you to
compile and run modern frameworks in the browser. You can either use one of our
predefined `components` for embedding the _CodeSandbox_ experience into your
projects, or you can build your own version of `sandpack`, on top of our
standard components and utilities. As you walk through this guide, you will get
deeper into our ecosystem.

## Single file

```js sandpack
export default function App() {
  return <p>Hello Docusaurus</p>;
}
```

````md
```js sandpack
export default function App() {
  return <p>Hello Docusaurus</p>;
}
```
````

## Multiples files

```````js sandpack template=react theme=codesandbox-dark
```js file=/App.js
import "./style.css"

export default function App() {
  return <p>Hello Docusaurus</p>;
}
``````css file=/style.css
body {
  background: red;
}
```;
```````

```````md
```````js sandpack template=react theme=codesandbox-dark
```js file=/App.js
import "./style.css"

export default function App() {
  return <p>Hello Docusaurus</p>;
}
``````css file=/style.css
body {
  background: red;
}
```;
```````
```````

## Theme: GitHub Light

```js sandpack theme=github-light
export default function App() {
  return <p>Hello Docusaurus</p>;
}
```

````md
```js sandpack theme=github-light
export default function App() {
  return <p>Hello Docusaurus</p>;
}
```
````
