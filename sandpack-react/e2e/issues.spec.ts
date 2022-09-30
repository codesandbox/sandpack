import { test, expect } from "@playwright/test";

test.describe("Issue", () => {
  test("toggles read-only mode (#454)", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=bug-reports-issues--issue-454"
    );

    // 1. it is not editable
    await expect(page.locator(".cm-content")).toHaveAttribute(
      "contenteditable",
      "true"
    );

    // 2. click on button and set read-only as true
    await page.locator(".trigger").click();

    // 3. it's not editable
    await expect(page.locator(".cm-content")).toHaveAttribute(
      "contenteditable",
      "false"
    );

    // ✅ 4. make sure the editor is mount
    await expect(page.locator(".cm-editor")).toHaveCount(1);
    await expect(page.locator(".pre-placeholder")).toHaveCount(0);
  });
});
