---
sidebar_position: 1
---

# Install

Sandpack is ready to be used in your React project. The package is published on `npm` and you can install it with:

```bash
npm i @codesandbox/sandpack-react
```

or

```bash
yarn add @codesandbox/sandpack-react
```

The package contains multiple **components**, **utilities** and **typings** for diving into
the `sandpack` ecosystem.

We packed all the components and the bundler inside the `Sandpack` component, which is a named export of the package.
Additionally, there is a small **stylesheet** you need to import globally into your project.

```jsx
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

/* JSX Usage */
<Sandpack template="react" />;
```

This should give you a nice code editor with some file tabs and a preview that runs in the browser.

```js sandpack template=react

```

:::success Congrats!
You have integrated the first Sandpack component into your project
:::
