const languages = ["html", "javascript", "jsx", "css", "less", "vue"];

languages.forEach((lang) => {
  it(`Should render a ${lang} component`, () => {
    cy.visit(
      `http://localhost:6006/iframe.html?id=components-codemirror--${lang}`
    );

    cy.get(".cm-editor").snapshot();
  });
});
