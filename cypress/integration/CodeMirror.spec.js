import * as mocks from "../../sandpack-react/src/components/CodeEditor/languages-mocks";

describe("CodeMirror", () => {
  Object.keys(mocks).forEach((lang, index) => {
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

  it("should load the autocomplete CodeMirror extension", () => {
    cy.viewport(600, 1000).visit(
      `/iframe.html?id=components-code-editor--extension-autocomplete`
    );

    // Remove all content from element editable
    cy.get(".cm-content").type("{selectall}").type("{backspace}");

    // Trigger autocomplete keybinding
    cy.get(".cm-content").type("{ctrl} ");

    // Wait for the autocomplete modal appears and select the first item
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200).focused().type("{enter}");

    /**
     * Take a snapshot of the current editor state,
     * which should contains a snippet code:
     *
     * ```
     * class name {
     *   constructor(params) {
     *
     *   }
     * }
     * ```
     */
    cy.get(".cm-content").snapshot();
  });
});
