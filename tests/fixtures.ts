import {
	test as base,
	chromium,
	type BrowserContext,
	Worker,
	firefox,
	webkit,
} from "@playwright/test";
import path from "path";

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
	serviceWorker: Worker;
	extensionUrl: string;
}>({
	context: async ({ browserName }, use) => {
		// For future usage
		const browserTypes = { chromium, firefox, webkit };
		const pathToExtension = path.join(__dirname, "../distribution");
		const context = await browserTypes[browserName].launchPersistentContext(
			"",
			{
				headless: false,
				serviceWorkers: "allow",
				// ignoreDefaultArgs: ['--headless'],
				args: [
					"--enable-logging",
					"--v=1",
					// `--headless=new`,
					`--disable-extensions-except=${pathToExtension}`,
					`--load-extension=${pathToExtension}`,
				],
			}
		);

		await use(context);
		await context.close();
	},
	serviceWorker: async ({ context }, use) => {
		const worker: Worker = await new Promise<Worker>((resolve) => {
			context.on("serviceworker", (currWorker: Worker) => {
				resolve(currWorker);
			});
		});

		await use(worker!);
	},
	extensionId: async ({ context }, use) => {
		// for manifest v3:
		// await new Promise((r) => setTimeout(r, 10000));

		let [background] = context.serviceWorkers();
		if (!background) background = await context.waitForEvent("serviceworker");

		const extensionId = background.url().split("/")[2];
		await use(extensionId);
	},
	extensionUrl: async ({ context }, use) => {
		// await new Promise((r) => setTimeout(r, 10000));
		let [background] = context.serviceWorkers();
		if (!background) background = await context.waitForEvent("serviceworker");

		const bgUrl = background.url();
		const slash = bgUrl.indexOf("/background");
		const extensionBaseURL = bgUrl.substring(0, slash + 1);

		await use(extensionBaseURL);
	},
});
export const expect = test.expect;
