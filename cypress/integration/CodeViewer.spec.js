import "cypress-real-events/support";

describe("CodeViewer", () => {
  it("should not be editable", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-viewer--component`
    );

    cy.get(".cm-content").should("have.attr", "contenteditable", "false");
  });

  it("should not be able to cut the content", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-viewer--component`
    );

    // Force select and Command+X: it should fail for non-ready-only component
    cy.get(".cm-content").trigger("mousedown").realPress(["Meta", "x"]);

    // content should still be there
    cy.get(".cm-content").snapshot();
  });
});
