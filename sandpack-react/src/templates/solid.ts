import type { SandboxTemplate } from "../types";

export const SOLID_TEMPLATE: SandboxTemplate = {
  files: {
    "/App.tsx": {
      code: `import { Component } from "solid-js";

const App: Component = () => {
  return <h1>Hello Solid!</h1>;
};

export default App;`,
    },
    "/index.tsx": {
      code: `import { render } from "solid-js/web";
import App from "./App";

import "./styles.css";

render(() => <App />, document.getElementById("app"));`,
    },
    "/styles.css": {
      code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`,
    },
    "/index.html": {
      code: `<html>
<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
</head>
<body>
  <div id="app"></div>
  <script src="src/index.tsx"></script>
</body>
</html>`,
    },
  },
  dependencies: {
    "solid-js": "1.3.15",
  },
  entry: "/index.tsx",
  main: "/App.tsx",
  environment: "solid",
};
