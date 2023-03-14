/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const walk = require("acorn-walk");
const { generate } = require("astring");

module.exports = function () {
  return {
    name: "remove-css",
    transform(code, id) {
      const ast = this.parse(code);

      const idArr = id.split("/");
      idArr.pop();

      const sourceDirPath = idArr.join("/");

      let isCssImported = false;

      walk.simple(ast, {
        ImportDeclaration: (_node) => {
          if (
            path.resolve(sourceDirPath, _node.source.value) ===
            path.join(__dirname, "../src/styles")
          ) {
            const specify = _node.specifiers?.find(
              (specify) => specify.imported.name === "css"
            );

            if (specify) {
              isCssImported = true;
              specify.imported.name = "fakeCss";
              specify.local.name = "fakeCss";
            }
          }
        },
        CallExpression: (_node) => {
          if (_node.callee.name === "css" && isCssImported) {
            _node.type = "Identifier";
            _node.name = "fakeCss";
            delete _node.arguments;
          }
        },
      });

      return {
        code: generate(ast),
      };
    },
  };
};
