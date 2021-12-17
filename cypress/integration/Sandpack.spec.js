const getIframeDocument = () => {
  return cy.get(".sp-preview-iframe").its("0.contentDocument").should("exist");
};

const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};

const accessPage = (wait) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.viewport(600, 1000)
    .visit(`/iframe.html?id=presets-template--react`)
    .wait(wait ? 2000 : 0); // warm-up sandbox
};

describe("Sandpack", () => {
  // TODO: To be fixed
  // it(`Should render a React template and be able to interact with`, () => {
  //   accessPage(true);
  //   getIframeBody().find("h1").should("have.text", "Hello World");

  //   cy.get(".cm-content").type("{command}A").type("{backspace}");
  //   cy.get(".cm-content").type(`export default function App() {
  // return <p className="target">Hello Sandpack</p>`);

  //   getIframeBody()
  //     .wait(200)
  //     .find("p.target")
  //     .should("have.text", "Hello Sandpack");
  // });

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
