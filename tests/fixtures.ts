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
		console.log("serviceWorker init");
		const worker: Worker = await new Promise<Worker>((resolve) => {
			context.on("serviceworker", (currWorker: Worker) => {
				resolve(currWorker);
			});
		});

		await use(worker!);
	},
});
export const expect = test.expect;
