import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(
    "http://localhost:6006/iframe.html?id=components-code-viewer--component"
  );
});

test.describe("CodeViewer", () => {
  test("should not be editable", async ({ page }) => {
    const content = page.locator(".cm-content");

    // ✅
    await expect(content).toHaveAttribute("contenteditable", "false");
  });

  test("should not be able to cut the content", async ({ page }) => {
    await page.locator(".cm-content").click();

    // Force select and Command+X: it should fail for non-ready-only component
    page.keyboard.press("Meta+x");

    // ✅ content should still be there
    const content = await page.innerText(".cm-content");
    expect(content).toContain(
      `We use the same configuration as Parcel to bundle this sandbox, you can find more`
    );
  });
});
