# Sandpack Beta

<img src="https://raw.githubusercontent.com/codesandbox/sandpack/main/demo.gif?token=ACL4CFQWS3YKIHBSI2HBPODAJOQAI" alt="Demo of a React component that edits the code while the bundler executes the changes" />

## What is this?

This repo contains different packages that form the sandpack ecosystem.

Sandpack is the browser bundler which powers **CodeSandbox**. The packages are
built on top of the bundler, offering abstractions that everyone can use to
integrate the bundler in their own projects. This project is currently in a
**beta** phase. Looking forward to seeing what the community can build with it.
Your feedback is more than welcome, please
[open an issue](https://github.com/codesandbox/sandpack/issues) if you have
trouble with the packages.

## sandpack-client

This is a small foundation package that sits on top of the bundler. It is
framework agnostic and facilitates the handshake between your context and the
bundler iframe.

## sandpack-react

A set of
[React components and hooks](https://github.com/codesandbox/sandpack/tree/main/sandpack-react)
that give you all the flexibility of building the right sandpack integration for
your project. If you are working with React, you should start with this package
as it is built on top of `sandpack-client` for all React use cases.

```jsx
import { Sandpack } from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';

<Sandpack template="react" />;
```

The
[package readme](https://github.com/codesandbox/sandpack/blob/main/sandpack-react/README.md)
contains a lot of examples of how to use the various _presets_, _components_ and
_hooks_ that are exported by the library.
