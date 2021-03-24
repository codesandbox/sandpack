# sandpack-client

A bundler that completely works in the browser and takes advantage of it.

## Why?

Online code playgrounds are getting more popular: they provide an easy way to
play with code without installation.

As CodeSandbox came along, it had a pretty basic bundler. However, as
CodeSandbox got more popular its bundler got more advanced. Nowadays the bundler
is used for all kinds of bigger web projects, and it would be a shame if others
couldn't use the functionality.

This library acts as an interface with the bundler of CodeSandbox. It allows you
to run any code on a web page, from Vue projects to React projects to Parcel
projects. With everything that CodeSandbox supports client side as well.

## So what can this bundler do?

This is a list of features that the bundler supports out of the box, the list
may be outdated.

1.  Hot Module Reloading API (`module.hot`)
2.  npm dependencies
3.  Most common transpilers (vue, babel, typescript, css, scss, less, stylus,
    parcel, etc...)
4.  Parallel transpiling
5.  On-demand transpiler loading
6.  Webpack loader syntax (`!raw-loader!./test.js`)
7.  Friendly error overlay (using `create-react-app` overlay)
8.  Transpilation result caching
9.  HTML/CSS entry points

## Example usage

This repo serves as an interface to communicate with the bundler. The bundler
itself is hosted on `{version}-sandpack.codesandbox.io` and is heavily cached by
a CDN. We also included the necessary files under `sandpack` if you want to host
the bundler yourself.

### Using the Client

The SandpackClient is a class implementation, you can import it from the
package.

```js
import { SandpackClient } from "@codesandbox/sandpack-client";

// There are two ways of initializing a preview, you can give it either an
// iframe element or a selector of an element to create an iframe on.
const client = new SandpackClient(
  "#preview", // iframe selector or element itself
  {
    files: {
      "/index.js": {
        code: `console.log(require('uuid'))`,
      },
    },
    entry: "/index.js",
    dependencies: {
      uuid: "latest",
    },
  } /* We support a third parameter for advanced options, you can find more info below */
);

// When you make a change you can just run `updatePreview`, we'll automatically discover
// which files have changed and hot reload them.
client.updatePreview({
  files: {
    "/index.js": {
      code: `console.log('New Text!')`,
    },
  },
  entry: "/index.js",
  dependencies: {
    uuid: "latest",
  },
});
```

If you specify a `package.json` in the list of files we will use that as source
of truth. Otherwise, we infer `dependencies` and `entry` from it:

```js
// We infer dependencies and the entry point from package.json
const PACKAGE_JSON_CODE = JSON.stringify(
  {
    title: "test",
    main: "index.js",
    dependencies: {
      uuid: "latest",
    },
  },
  null,
  2
);

// Give it either a selector or an iframe element as first argument, the second arguments are the files
const client = new SandpackClient("#preview", {
  files: {
    "/index.js": {
      code: `console.log(require('uuid'))`,
    },
    "/package.json": {
      code: PACKAGE_JSON_CODE,
    },
  },
});
```

### SandboxInfo

The second argument in the constructor of `SandpackClient` is all sandbox info.
It has this structure:

```ts
{
  /**
   * Files, keys are paths.
  **/
  files: {
    [path: string]: {
      code: string
    }
  },
  /**
   * Dependencies, supports npm and GitHub dependencies
  **/
  dependencies?: {
    [dependencyName: string]: string
  },
  /**
   * Default file to evaluate
  **/
  entry?: string,
  /**
   * The sandbox template to use, this is inferred from the files and package.json if not specified
  **/
  template?: string
}
```

### ClientOptions

The third argument in the constructor of `SandpackClient` is extra options. Here
you can pass custom bundling/evaluation options or instructions for what and how
to render inside the iframe:

```ts
{
  /**
   * Location of the bundler. Defaults to `${version}-sandpack.codesandbox.io`
   */
  bundlerURL?: string;
  /**
   * Width/Height of the iframe.
   */
  width?: string;
  height?: string;
  /**
   * If we should skip the third step: evaluation. Useful if you only want to see
   * transpiled results
   */
  skipEval?: boolean;
  /**
   * Boolean flags to trigger certain UI elements in the bundler
   */
  showOpenInCodeSandbox?: boolean;
  showErrorScreen?: boolean;
  showLoadingScreen?: boolean;
}
```

### Client API

The client instance has several helper functions you can call.

#### `updatePreview`

Send new content like files and dependencies, to the preview. It will
automatically hot update the preview with the new files and options. Accepts a
single argument `sandboxInfo` of type `SandboxInfo`.

#### `updateOptions`

Updates the given options and then updates the preview. Accepts a single
argument `options` of type `ClientOptions`.

#### `dispatch`

Dispatch an event to the bundler and all other listeners. Accepts a single
argument, which is the data to send. The `dispatch` function will pass the
internal `id` of the client, so only the bundler that performed the handshake
with this client instance will respond.

```js
client.dispatch({ type: "refresh" }); // sends a refresh action to the bundler
```

#### `listen`

Listens to events coming from the bundler that performed the handshake with this
client instance. Uses the internal `id` to filter events coming from other
bundlers.

```js
client.listen((message) => {
  if (message.type === "status") {
    console.log(message.status);
  }
});
```

#### `getCodeSandboxURL`

Create a sandbox from the current files and return an object in this form:

```js
{
  sandboxId: sandbox_id,
  editorUrl: `https://codesandbox.io/s/${sandbox_id}`,
  embedUrl: `https://codesandbox.io/embed/${sandbox_id}`,
}
```

## Why is the bundler hosted externally and not a simple `import`?

We have three reasons to host the bundler of sandpack externally:

### Security

The bundler evaluates and transpiles all files in an iframe under a different
subdomain. This is important, because it prevents attackers from tampering with
cookies of the host domain when evaluating code.

### Performance

We heavily make use of Web Workers for transpilations. Almost all our
transpilation happens in web workers, and there is no easy way yet to bundle
this in a library.

### Bundle Size

Another reason to host the bundler externally is because of code splitting: we
split all our transpilers away and load them on-demand. If a user doesn't use
`sass` we won't load the transpiler. This wouldn't be possible if we would give
one big JS file as the library.

### Offline Support

We use Service Workers to download all transpilers in the background, so the
next time a user visits your website they don't have to download the bundler
anymore and it can be used offline. This is possible because we host the service
worker externally.

> I want to highlight that you can also host the bundler by yourself, all
> necessary files are in the `sandpack` folder.

## Self Hosting Bundler

If you want to host the bundler yourself, you will need to do a few things.

- The bundler is part of the codesandbox-client codebase: https://github.com/codesandbox/codesandbox-client
- Clone the codesandbox-client and install the dependencies in the root folder (`yarn install`).
- `yarn build:deps` to build some of the packages lerna needs for internal links.
- create your instance of sandpack with `yarn build:sandpack`.

This creates a `www` folder in the root of `codesandbox-client`. That `www` folder is the
sandpack folder sandpack-client connects to on `{version}-sandpack.codesandbox.io`.
Once you have this hosted on your end you can pass `bundlerURL` when calling:

```js
new SandpackClient(iframe, sandboxInfo, {
  bundlerURL: "https://your-hosted-version",
});
```

or, if you use sandpack-react, you can bundlerURL in the `options` of the Sandpack preset.

## For React developers

If you want to integrate the sandpack bundler into your React project, we
recomment you check out the
[sandpack-react package](https://github.com/codesandbox/sandpack/tree/main/sandpack-react),
which has all the components and hooks you need for building an instant code
running experience for your users.
