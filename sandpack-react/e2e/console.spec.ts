import { test, expect } from "@playwright/test";

test.describe("Console", () => {
  test("should print the log on SandpackConsole component", async ({
    page,
  }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=components-console--main"
    );

    // Dispatch a log
    await page.frameLocator("iframe").locator("text=string").click();

    // wait for console dispatch
    await page.waitForTimeout(1000);

    // ✅ find the console.log message
    const consoleComponentText = await page
      .locator(".sp-console pre")
      .innerText();
    expect(consoleComponentText).toContain('"Lorem ipsum"');
  });
});
