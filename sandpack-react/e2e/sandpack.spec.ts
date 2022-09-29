import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(
    "http://localhost:6006/iframe.html?id=bug-reports-issues--file-tab"
  );
});

test.describe("Sandpack preset", () => {
  test("Should be able to navigate between files", async ({ page }) => {
    const mainFileContent = await page.innerText("div.cm-content");

    // Initial file
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

    // Second file
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
