import { test, expect } from "./fixtures";

test.describe("Both tests should work", () => {
	test.describe("This one has no serviceWorker fixture dependency", () => {
		test("This will work", async () => {
			await expect(true).toBe(true);
		});
	});

	test.describe("The one with the serviceWorker dependency", () => {
		test("This will fail in Docker", async ({ serviceWorker }) => {
			await expect(true).toBe(true);
		});
	});
});
