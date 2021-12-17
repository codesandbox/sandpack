describe("CodeMirror", () => {
  const languages = ["html", "javascript", "jsx", "css", "less", "vue"];

  languages.forEach((lang, index) => {
    it(`Should render a "${lang}" component with a proper syntax-highlight`, () => {
      cy.viewport(600, 1000).visit(
        `/iframe.html?id=components-codemirror--${lang}`
      );
      cy.get(".cm-content")
        .wait(index === 0 ? 400 : 0) // warm-up storybook
        .invoke("attr", "style", "tab-size: 4;")
        .snapshot();
    });
  });

  it("should render a decoration component properly", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-viewer--decorators`
    );

    cy.get(".cm-content").invoke("attr", "style", "tab-size: 4;").snapshot();
  });
});
