import { SANDBOX_TEMPLATES } from "../../sandpack-react/src/templates";

const accessPage = (template) => {
  const timeout = template === "solid" ? 10000 : 7000;
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.viewport(600, 1000)
    .visit(`/iframe.html?id=presets-template--${template}`, { timeout })
    .wait(7000); // warm-up sandbox
};
const getIframeDocument = () => {
  return cy.get(".sp-preview-iframe").its("0.contentDocument");
};

const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};

describe("Templates", () => {
  Object.keys(SANDBOX_TEMPLATES).forEach((template) => {
    it(`Should run the ${template} template`, () => {
      accessPage(template);

      getIframeBody().find("h1").should("have.text", "Hello World");
    });
  });
});
