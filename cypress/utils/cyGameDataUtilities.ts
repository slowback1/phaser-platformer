export default class CyGameDataUtilities {
	//@ts-ignore
	public static getDataByKey(key: string, alias: string): Chainable<JQuery<HTMLElement>> {
		return cy
			.get("div[cy-game-data__key='" + key + "']")
			.invoke("attr", "cy-game-data__value")
			.as(alias);
	}
	public static validateKeyIsEqualToValue(key: string, value: string): void {
		const keyValue = `${key}-value`;

		CyGameDataUtilities.getDataByKey(key, keyValue);
		cy.get(`@${keyValue}`).should("eql", value);
	}
	public static validateKeyIsGreaterThanValue(key: string, value: number): void {
		const keyValue = `${key}-value`;

		CyGameDataUtilities.getDataByKey(key, keyValue);
		cy.get(`@${keyValue}`)
			.then(t => Number(t))
			.should("gt", value);
	}

	public static validateKeyIsLessThanValue(key: string, value: number): void {
		const keyValue = `${key}-value`;

		CyGameDataUtilities.getDataByKey(key, keyValue);
		cy.get(`@${keyValue}`)
			.then(t => Number(t))
			.should("lt", value);
	}

	public static validateAliasDidNotChange(alias: string, newAlias: string) {
		cy.get(`@${alias}`).then(value => {
			cy.get(`@${newAlias}`).should("eql", value);
		});
	}
}
