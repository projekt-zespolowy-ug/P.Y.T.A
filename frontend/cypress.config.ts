import { defineConfig } from "cypress";

export default defineConfig({
	  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'output-[hash].xml',
  },
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: "http://localhost:3000",
	},

	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},
});
