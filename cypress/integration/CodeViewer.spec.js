describe("CodeViewer", () => {
  it("should render a decoration component properly", () => {
    cy.visit(`/iframe.html?id=components-code-viewer--decorators`);

    cy.get(".cm-editor").snapshot();
  });
});
