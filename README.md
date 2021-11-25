# Sandpack

<img src="https://user-images.githubusercontent.com/4838076/143455636-1e118fa2-3c9d-48c0-898e-aa3f44a0ad66.gif" alt="Component toolkit for live running code editing experiences" />

## What is this?

Sandpack is a component toolkit for creating your own live running code editing experience powered by CodeSandbox.

## Sandpack client

This is a small foundation package that sits on top of the bundler. It is
framework agnostic and facilitates the handshake between your context and the bundler iframe.

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/client)

## Sandpack React

React components that give you the power of editable sandboxes that run in the browser.

```jsx
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

<Sandpack template="react" />;
```

[Read more](https://sandpack.codesandbox.io/)

## Documentation

For full documentation, visit [https://sandpack.codesandbox.io/docs/](https://sandpack.codesandbox.io/docs/)
