/**
 * @jest-environment jsdom
 */

import { validateHtml } from "./utils";

describe(validateHtml, () => {
  it("returns a valid HTML string", () => {
    const content =
      "<html><head><title>Test</title></head><body><p>Hello world!</p></body></html>";
    const validatedContent = validateHtml(content);

    expect(validatedContent).toContain("<!DOCTYPE html>");
    expect(validatedContent).toContain(
      '<html lang="en"><head><title>Test</title></head><body><p>Hello world!</p></body></html>'
    );
  });

  it("adds html/head/body tags to an empty string", () => {
    const content = "";
    const validatedContent = validateHtml(content);

    expect(validatedContent).toContain("<!DOCTYPE html>");
    expect(validatedContent).toContain(
      '<html lang="en"><head></head><body></body></html>'
    );
  });

  it("shouldn't change anything if a valid document is provided ", () => {
    const content = `<!DOCTYPE html>
<html lang="en"><head></head>
  <body>
    <h1>Hello World</h1>
  </body></html>`;

    expect(validateHtml(content)).toBe(content);
  });

  it("should add the lang attribute to the html if not provided", () => {
    const content = `<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>Hello World</h1>
</body>
</html>`;

    const validatedContent = validateHtml(content);

    expect(validatedContent).toContain("<!DOCTYPE html>");
    expect(validatedContent).toContain('<html lang="en">');
  });

  it("shouldn't change the land attr if a custom value is provided", () => {
    const content = `<!DOCTYPE html>
<html lang="pt-BR">
  <head></head>
  <body>
    <h1>Hello World</h1>
</body>
</html>`;

    const validatedContent = validateHtml(content);

    expect(validatedContent).toContain("<!DOCTYPE html>");
    expect(validatedContent).toContain('<html lang="pt-BR">');
  });
});
