import { test, expect } from "./fixtures";

test.describe("Options page", () => {
	test("Should show options page", async ({ page, extensionId }) => {
		await page.goto(`chrome-extension://${extensionId}/options.e17f98f3.html`);

		await expect(page).toHaveScreenshot({ fullPage: true });
	});
});
