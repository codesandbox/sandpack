---
sidebar_position: 1
---

# Introduction

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

````js sandpack template=react theme=codesandbox-dark
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
````

`````md
````js sandpack template=react theme=codesandbox-dark
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
````
`````

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
