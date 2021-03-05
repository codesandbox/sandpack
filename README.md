# Sandpack Beta

<img src="https://raw.githubusercontent.com/codesandbox/sandpack/main/demo.gif?token=ACL4CFQWS3YKIHBSI2HBPODAJOQAI" alt="Demo of a React component that edits the code while the bundler executes the changes" />

## What is this?

This repo contains different packages that form the sandpack ecosystem.

Sandpack is the browser bundler which powers **CodeSandbox**. The packages are built on top of the bundler, offering abstractions that everyone can use to integrate the bundler in their own projects. This project is currently in a **beta** phase. Looking forward to seeing what the community can build with it. Your feedback is more than welcome, please [open an issue](https://github.com/codesandbox/sandpack/issues) if you have trouble with the packages.

## sandpack-client

This is a very small foundation package that sits on top of the bundler and facilitates the handshake between your context and the bundler iframe.

## sandpack-react

A set of [React components and hooks](https://github.com/codesandbox/sandpack/tree/main/sandpack-react) that give you all the flexibility of building the perfect sandpack integration for your project.
