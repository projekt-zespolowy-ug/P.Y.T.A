import user from "../fixtures/user.json";

describe("Signing up", () => {
	it("should signup a  user", () => {
		cy.visit("/");

		cy.get('a[href*="auth/sign-in"]').click();
		cy.url().should("include", "/auth/sign-in");

		cy.get('a[href*="auth/sign-up"]').click();
		cy.url().should("include", "/auth/sign-up");

		cy.get("input[name=email]").type(user.email);
		cy.get("input[name=password]").type(user.password);
		cy.get("input[name=confirmPassword]").type(user.password);
		cy.get("input[name=name]").type(user.name);
		cy.get("input[name=lastName]").type(user.last_name);

		cy.get("button[name=signUpDateOfBirth]").click();

		cy.get("button[name=monthTrigger]").click();

		cy.get("div[role=listbox] [role=option]")
			.should("be.visible")
			.eq(5)
			.click();

		cy.get("button[name=yearTrigger]").click();

		cy.get("div[role=listbox] [role=option]")
			.should("be.visible")
			.first()
			.click();

		cy.get("[role=gridcell]").contains("15").click();

		cy.get("button[role=checkbox]").click();

		cy.get("button[type=submit]").should("not.be.disabled").click();

		cy.get("button[name=avatar-dropdown-menu]").should("be.visible").click();
		cy.get("button[name=sign-out-btn]").should("be.visible").click();

		cy.get("a[id=signInLink]").should("be.visible");
	});
});
