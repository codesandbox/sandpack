import { commonFiles } from "../common";

export const SOLID_TEMPLATE = {
  files: {
    ...commonFiles,
    "/App.tsx": {
      code: `import { Component } from "solid-js";

const App: Component = () => {
  return <h1>Hello world</h1>
};

export default App;`,
    },
    "/index.tsx": {
      code: `import { render } from "solid-js/web";
import App from "./App";

import "./styles.css";

render(() => <App />, document.getElementById("app"));`,
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
    "/package.json": {
      code: JSON.stringify({
        dependencies: {
          "solid-js": "1.3.15",
        },
        main: "/index.tsx",
      }),
    },
  },
  main: "/App.tsx",
  environment: "solid",
};
