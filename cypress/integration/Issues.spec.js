describe("Issue", () => {
  it("toggles read-only mode (#454)", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=bug-reports-issues--issue-454`
    );

    // 1. it's editable
    cy.get(".cm-content").should("have.attr", "contenteditable", "true");

    // 2. click on button and set read-only as true
    cy.get(".trigger").click();

    // 3. it's not editable
    cy.get(".cm-content").should("have.attr", "contenteditable", "false");

    // 4. make sure the editor is mount
    cy.get(".cm-editor").should("exist");
    cy.get(".pre-placeholder").should("not.exist");
  });
});
