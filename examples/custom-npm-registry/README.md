# Sandpack custom npm registry (proxy)

This project works as a recipe to proxy NPM registries. The main goal is to consume private packages and expose them through a private registry without any authentication token (GitHub or Npm) or requiring any authentication process, 

This new private registry can be used on a Sandpack instance and run private packages public. 

Disclaimer: it would be best if you kept in mind that it will expose all private packages in your account, so be careful where this proxy will be used and the scopes of the authentication token. That's why we initially set this project for read-only purposes, meaning no user would be able to publish changes using this proxy.

## How it works
This project relies on [Verdaccio](https://verdaccio.org/), an open-source project that creates a private registry and can proxy other registries, such as GitHub and Npm. 

## How to use

1. Host this project somewhere, and make sure it has permission to create new folders and files - Verdaccio needs to create temp storage to perform some optimizations;
2. Configure your project correctly, for example, if you want to proxy NPM, GitHub, or both. You can find instructions on `/index.js`;
3. Set the environments variables, considering the type of registry you want to use;


## Environment variables

| Name | Description |
| - | - |
| `VERDACCIO_PUBLIC_URL` | is intended to be used behind proxies, and replace the final URL|
| `GH_PKG_TOKEN` | GitHub personal token with `read:packages` permission |