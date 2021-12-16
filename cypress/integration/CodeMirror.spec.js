const languages = ["html", "javascript", "jsx", "css", "less", "vue"];

describe("CodeMirror", () => {
  languages.forEach((lang) => {
    it(`Should render a "${lang}" component with a proper syntax-highlight`, () => {
      cy.visit(`/iframe.html?id=components-codemirror--${lang}`);

      cy.get(".cm-editor").snapshot();
    });
  });
});
