export default abstract class DSL {
	constructor() {
		this.visit();
	}

	protected visit(): void {
		cy.visit("http://localhost:5173");
	}

	protected makeInput(key: string) {
		return cy.get("#app").trigger("keydown", { key });
	}
}
