# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Building Locally
- Install [Node.js](https://nodejs.org/en/) version 14(latest stable)
    - If you are using [nvm](https://github.com/nvm-sh/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Clone [this repo](https://github.com/codesandbox/sandpack) and install dependecies

```
git clone https://github.com/codesandbox/sandpack
cd sandpack/website/docs && yarn 
```

before you start the local development server you need to build all dependencies running the next command:
```
yarn build
```
and finally run:
```
yarn run serve
```

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
