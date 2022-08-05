# Sandpack custom npm registry (proxy)

This project works as a recipe to proxy NPM registries. The main goal is to enable the consumption of private packages and expose them through a private registry without any authentication token (GitHub or Npm) or requiring an authentication process. 

This new private registry can be used on a Sandpack instance and run private packages public. 

Disclaimer: it's essential to keep the information and tokens of the npm registry private! By using this method, it's best to keep in mind that it could expose all private packages in your account. Be careful where and how this proxy will be used. Make sure to use authentication tokens with **read-only access**.

It's also possible to expose only specific packages. If the custom scopes are `@scope/package-name` instead of `@scope/*`, it will only expose that particular package. You can even do something like `@scope/design-system*` to expose all packages of the design system.

## How it works
This project relies on [Verdaccio](https://verdaccio.org/), an open-source project that creates a private registry and can proxy other registries, such as GitHub and Npm. 

## How to use

1. Host this project somewhere, and make sure it has permission to create new folders and files - Verdaccio needs to create temp storage to perform some optimizations;
2. Configure your project correctly, for example, if you want to proxy NPM, GitHub, or both. You can find instructions in `/index.js`;
3. Set the environments variables according to the type of registry you want to use;


## Environment variables

| Name | Description |
| - | - |
| `VERDACCIO_PUBLIC_URL` | is intended to be used behind proxies, and replace the final URL (optional) |
| `GH_PKG_TOKEN` | GitHub personal token with `read:packages` permission |