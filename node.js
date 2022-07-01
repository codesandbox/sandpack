const http = require("http");

const host = "localhost";
const port = 3000;

const wait = () => new Promise((resolve) => setTimeout(resolve, 5000));

const requestListener = async function (req, res) {
  await wait();
  res.setHeader("Content-Type", "text/plain");
  res.writeHead(200);
  res.end(`git@github.com:christianalfoni/sandpack.git`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
