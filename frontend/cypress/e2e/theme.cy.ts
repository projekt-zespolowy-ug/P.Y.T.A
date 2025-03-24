describe("template spec", () => {
	it("passes", () => {
		cy.visit("/");

		cy.get("button[name='bar-menu-trigger']").click();

		changeMode("light");
		cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
		changeMode("dark");
		cy.get("body").should("have.css", "background-color", "rgb(10, 10, 10)");
	});

	const changeMode = (mode: string) => {
		cy.get("button[name='theme-select-trigger']").click();

		cy.get(`div[data-test-id='${mode}-switch']`).click();
	};
});
