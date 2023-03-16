/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

module.exports = function () {
  return {
    name: "remove-css",
    buildEnd() {
      fs.writeFileSync(
        "dist/unstyled.d.ts",
        `export * from './unstyled/index';`
      );
    },
  };
};
