/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const express = require("express");

const PORT = +(process.env.PORT || 8080);
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");

async function run() {
  const app = express();

  app.use(express.static(DIST_DIR));

  app.get("*", function (req, res) {
    res.sendFile(INDEX_FILE);
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

run();
