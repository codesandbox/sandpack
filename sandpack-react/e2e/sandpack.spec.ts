import { test, expect } from "@playwright/test";

test.describe("Sandpack", () => {
  test("Should be able to run a sandbox and edit the content", async ({
    page,
  }) => {
    await page.goto(
      `http://localhost:6006/iframe.html?id=presets-template--react`
    );

    test.setTimeout(30000 * 3); // triple default

    const headingIframe = await page
      .frameLocator("iframe")
      .locator("h1")
      .innerText();

    // ✅ Initial state
    expect(headingIframe).toBe("Hello World");

    // Insert new content
    await page.locator(".cm-content").fill(`export default function App() {
      return <h1>Hello Sandpack</h1>
    }`);

    // Wait to the bundler applies changes
    await page.waitForTimeout(2000);

    // ✅ Asset new content on iframe
    const newHeadingIframe = await page
      .frameLocator("iframe")
      .locator("h1")
      .innerText();
    expect(newHeadingIframe).toBe("Hello Sandpack");
  });

  test("Should be able to navigate between files", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=bug-reports-issues--file-tab"
    );

    const mainFileContent = await page.innerText("div.cm-content");

    // ✅ Initial file
    expect(mainFileContent).toBe(
      `export default function App() {
  return <h1>Hello World</h1>
}

`
    );

    // Change file
    await page
      .locator(".sp-tabs-scrollable-container [title='/styles.css']")
      .click();

    const secondFileContent = await page.innerText("div.cm-content");

    // ✅ Second file
    expect(secondFileContent).toContain(
      `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
`
    );
  });
});
