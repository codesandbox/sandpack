import { commonFiles } from "./common";

export const STATIC_TEMPLATE = {
  files: {
    ...commonFiles,
    "/index.html": {
      code: `<!DOCTYPE html>
<html>

<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/styles.css" />
</head>

<body>
  <h1>Hello world</h1>
</body>

</html>`,
    },
    "/package.json": {
      code: JSON.stringify({
        dependencies: {},
        main: "/index.html",
      }),
    },
  },
  main: "/index.html",
  environment: "static",
};
