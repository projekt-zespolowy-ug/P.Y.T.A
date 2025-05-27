import stocks from "../fixtures/stocks.json";
import user from "../fixtures/user.json";
describe("Signing up", () => {
	it("should signup a  user", () => {
		cy.visit("/");

		cy.get('a[href*="auth/sign-in"]').click();
		cy.url().should("include", "/auth/sign-in");

		cy.get("input[name=email]").type(user.email);
		cy.get("input[name=password]").type(user.password);

		cy.get("button[type=submit]").should("not.be.disabled").click();

		cy.get("button[name=avatar-dropdown-menu]").should("be.visible").click();

		const searchBar = cy.get("input[name=stock-search-bar]");

		searchBar.should("be.visible").type("pyta", { force: true });

		cy.get("td[data-name=stock-table-results]").contains("No results");

		searchBar.clear().type(stocks.testStock.searchName);

		cy.get(`tr[data-ticker=${stocks.testStock.ticker}]`)
			.should("be.visible")
			.click();

		cy.url().should("include", `/stocks/${stocks.testStock.ticker}`);

		cy.get("foreignObject").should("be.visible");

		cy.get("footer").scrollIntoView();
		cy.get("input[name=stock-amount-input]").should("be.visible").type("2");

		cy.get("button[name=buy-btn]").should("be.visible").click();
		cy.get("button[name=sell-btn]").should("be.visible").click();
	});
});
