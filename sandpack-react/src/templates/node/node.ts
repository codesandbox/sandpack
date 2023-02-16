export const NODE_TEMPLATE = {
  files: {
    "/index.js": {
      code: `const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello world');
});

server.listen(port, hostname, () => {
  console.log(\`Server running at http://\${hostname}:\${port}/\`);
});`,
    },

    "/package.json": {
      code: JSON.stringify({
        dependencies: {},
        scripts: { start: "node index.js" },
        main: "index.js",
      }),
    },
  },
  main: "/index.js",
  environment: "node",
};
