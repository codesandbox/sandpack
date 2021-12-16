const languages = ["html", "javascript", "jsx", "css", "less", "vue"];

describe("CodeMirror", () => {
  languages.forEach((lang) => {
    it(`Should render a "${lang}" component with a proper syntax-highlight`, () => {
      cy.viewport(1200, 1500).visit(
        `/iframe.html?id=components-codemirror--${lang}`
      );

      cy.get(".cm-content").invoke("attr", "style", "tab-size: 4;").snapshot();
    });
  });
});
