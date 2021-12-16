describe("CodeViewer", () => {
  it("should render a decoration component properly", () => {
    cy.viewport(1200, 1500).visit(
      `/iframe.html?id=components-code-viewer--decorators`
    );

    cy.get(".cm-content").invoke("attr", "style", "tab-size: 4;").snapshot();
  });
});
