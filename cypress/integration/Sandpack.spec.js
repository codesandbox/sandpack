const accessPage = (wait) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.viewport(600, 1000)
    .visit(`/iframe.html?id=bug-reports-issues--file-tab`)
    .wait(wait ? 10000 : 0); // warm-up sandbox
};

describe("Sandpack", () => {
  it(`Should be able to navigate between files`, () => {
    accessPage();

    cy.get(".cm-content").should(
      "have.text",
      `export default function App() {  return <h1>Hello World</h1>}`
    );

    cy.get(".sp-tabs-scrollable-container [title='/styles.css']").click();

    cy.get(".cm-content").should(
      "have.text",
      `body {  font-family: sans-serif;  -webkit-font-smoothing: auto;  -moz-font-smoothing: auto;  -moz-osx-font-smoothing: grayscale;  font-smoothing: auto;  text-rendering: optimizeLegibility;  font-smooth: always;  -webkit-tap-highlight-color: transparent;  -webkit-touch-callout: none;}h1 {  font-size: 1.5rem;}`
    );
  });
});
