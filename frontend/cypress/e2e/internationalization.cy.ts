import * as en from "../../messages/en.json";
import * as pl from "../../messages/pl.json";

describe("Localization and Navigation", () => {
	it("switches language and updates UI elements accordingly", () => {
		cy.visit("/");

		cy.get("a[href='/en']").should("be.visible").contains("Profit");

		cy.url().should("include", "/en");
		checkUI(en);

		cy.get("button[name=localeSwitcherTrigger]").click();
		cy.get("div[data-test-id=lang-pl]").click();

		cy.url().should("include", "/pl");
		checkUI(pl);
	});

	// @ts-ignore: no other possibility to do this imo
	function checkUI(lang) {
		cy.get("button[name=industryTrigger]")
			.should("be.visible")
			.contains(lang.StockTable.selects.industry);
		cy.get("button[name=exchangeTrigger]")
			.should("be.visible")
			.contains(lang.StockTable.selects.exchange);
		cy.get(`input[placeholder="${lang.StockTable.headers.search}"]`);
		cy.get('a[href*="auth/sign-in"]').contains(lang.Header.RightTabs.signIn);
	}
});
