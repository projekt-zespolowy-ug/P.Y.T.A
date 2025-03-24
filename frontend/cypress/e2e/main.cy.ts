import type { SignUpRequestBody } from "../../src/types/api-requests";
describe("Signing up", () => {
	it("should signup a  user", () => {
		const userInfo: SignUpRequestBody = {
			date_of_birth: "",
			email: "pregnant@man11.com",
			last_name: "man",
			password: "Admin123.",
			name: "pregnant",
		};

		cy.visit("/");

		cy.get('a[href*="auth/sign-in"]').click();
		cy.url().should("include", "/auth/sign-in");

		cy.get('a[href*="auth/sign-up"]').click();
		cy.url().should("include", "/auth/sign-up");

		cy.get("input[name=email]").type(userInfo.email);
		cy.get("input[name=password]").type(userInfo.password);
		cy.get("input[name=confirmPassword]").type(userInfo.password);
		cy.get("input[name=name]").type(userInfo.name);
		cy.get("input[name=lastName]").type(userInfo.last_name);

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
