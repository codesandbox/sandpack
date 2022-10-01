import { test, expect } from "@playwright/test";

import { SANDBOX_TEMPLATES } from "../src/templates";

test.describe("Templates", () => {
  Object.keys(SANDBOX_TEMPLATES).forEach((template) => {
    if (template === "test-ts") return null; // tests there is no preview

    test(`Should run the ${template} template`, async ({ page }) => {
      await page.goto(
        `http://localhost:6006/iframe.html?id=presets-template--${template}`
      );

      test.setTimeout(30000 * 3); // triple default

      const headingIframe = await page
        .frameLocator("iframe")
        .locator("h1")
        .innerText();

      // ✅ find the "hello world" message
      expect(headingIframe).toBe("Hello World");
    });
  });
});
