---
sidebar_position: 2
title: Private packages
---

<big>The custom private npm registry allows Sandpack instances to retrieve npm packages from your npm registry. This option requires running a third service (Node.js server) and configuring your Sandpack provider to consume these dependencies from another registry, not the public ones.</big>

<br/>
<br/>

![Private packages](/img/private-package.png)

<br/>

**You'll need:**
- Host a Node.js server, which will run registry proxy;
- GitHub/NPM authentication token with at least read access;

## Self-host the proxy

We recommend hosting a service that allows you to proxy your private packages from a registry (GitHub/Npm/your own) to a new one, which would make the packages available through another URL. 
As Sandpack bundles everything in-browser, it needs to find a way to connect to the registry that can provide the project dependencies. First, Sandpack will try to fetch all dependencies from public registries, for example, `react` or `redux`. Then you can let Sandpack know which dependencies (or dependencies under a scope) should be fetched from a different registry, your custom registry, for example.

### Our recommendation
Suppose you don't already have a public registry. In that case, we recommend using [Verdaccio](https://verdaccio.org/), an open-source project that creates a private registry and can proxy other registries, such as GitHub and Npm. 
You can find examples of how to use the [examples folder](https://github.com/codesandbox/sandpack/tree/main/examples) in the main repository.

## Sandpack configuration

Once the proxy is running and configured, you need to set some options in your Sandpack context:

```jsx
 <Sandpack
    customSetup={{
      dependencies: { "@codesandbox/test-package": "1.0.5" },
      npmRegistries: [
        {
          enabledScopes: ["@codesandbox"],
          limitToScopes: true,
          registryUrl: "PROXY_URL", 
        },
      ],
    }}
    files={{
      "/App.js": `import { Button } from "@codesandbox/test-package"

export default function App() {
  return (
    <div>
      <Button>I'm a private Package</Button>
    </div>
  )
}
`,
    }}
    template="react"
  />
```

## Security
It's essential to keep the information and tokens of the npm registry private, so by using this method, it would be best if you kept in mind that it might expose all private packages in your account, so be careful where and how this proxy will be used. Plus, make sure only to use authentication tokens with read-only access.

It's also possible to define only certain packages to be exposed. If custom scopes are `@scope/package-name` instead of `@scope/*`, it will only expose that one package. You can even do something like `@scope/design-system*` to expose all packages of the design system or something.

