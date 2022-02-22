describe("CodeViewer", () => {
  it("should not be editable", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-viewer--component`
    );

    cy.get(".cm-content").type("{selectall}").type("{backspace}");

    cy.get(".cm-content").snapshot();
  });

  it("should not be able to cut the content", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-viewer--component`
    );

    cy.get(".cm-content").type("{selectall}").type("{meta}x");

    cy.get(".cm-content").snapshot();
  });
});
