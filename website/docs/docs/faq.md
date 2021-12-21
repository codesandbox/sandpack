---
sidebar_position: 5
title: FAQ
---

# Frequently asked questions

**What is Sandpack?**

Sandpack is an open ecosystem of components and utilities that allow you to compile and run modern frameworks in the browser. You can either use one of our predefined `components` for embedding the *CodeSandbox* experience into your projects, or you can build your own version of `sandpack`, on top of our standard components and utilities. As you walk through this guide, you will get deeper into our ecosystem.

**How to load local or private dependencies?**

Currently, Sandpack doesn’t have a way to consume private dependencies from any kind of registry service, due to the bundler host is shared with all Sandpack consumers apps. However, you can pass local dependencies just like a regular file or using external resource API:

```jsx
<Sandpack
    customSetup={{
        files: {
            "/App.js": APP_CODE,
            "/node_modules/fake-library/package.json": JSON.stringify({
                name: "fake-library",
                main: "./index.js",
            }),
            "/node_modules/fake-library/index.js": `module.exports = {
        hello: (name) => "Hello " + name
      }`,
        },
    }}
    template="react"
/>
```

**Does Sandpack support NextJs or other server-side applications?**

These kinds of sandboxes are backed by a container running on a server. Therefore we can't easily support this in the Sandpack library, as you'd probably have to host your own servers in that case or integrate entirely with our APIs, which likely requires logins and paying above certain limits.

**How to highlight TypeScript errors in the editor?**

Sandpack still doesn't officially support any kind of language server to provide a way to highlight errors in the `SandpackCodeEditor`. However, there is a discussion of how to make it work on [this topic](https://github.com/codesandbox/sandpack/discussions/237), with some examples and Codemirror documentation references of how to implement it.

**Why is the bundler hosted externally (iframe) and not a simple JavaScript module?**

There are a few reasons for hosting the bundler like this, as opposed to having it exported as library code, read more [here](/advanced-usage/client#why).
