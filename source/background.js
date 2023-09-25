// eslint-disable-next-line import/no-unassigned-import
import "./options-storage.js";

global.testField = Object.assign(global.testField ?? {}, {
	config: {
		user: "test",
		tests: "string",
	},
});
