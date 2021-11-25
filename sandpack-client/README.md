# Sandpack client

<img src="https://user-images.githubusercontent.com/4838076/143455636-1e118fa2-3c9d-48c0-898e-aa3f44a0ad66.gif" alt="Component toolkit for live running code editing experiences" />

This is a small foundation package that sits on top of the bundler. It is
framework agnostic and facilitates the handshake between your context and the bundler iframe.

```js
import { SandpackClient } from "@codesandbox/sandpack-client";

const client = new SandpackClient("#preview", {
  files: {
    "/index.js": {
      code: `console.log(require('uuid'))`,
    },
  },
  entry: "/index.js",
  dependencies: {
    uuid: "latest",
  },
});
```

[Read more](https://sandpack.codesandbox.io/docs/advanced-usage/client)
