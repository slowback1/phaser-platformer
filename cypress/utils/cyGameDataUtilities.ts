export default class CyGameDataUtilities {
	public static getDataByKey(key: string, alias: string): void {
		cy.get("div[cy-game-data__key='" + key + "']")
			.invoke("attr", "cy-game-data__value")
			.as(alias);
	}
	public static validateKeyIsEqualToValue(key: string, value: string): void {
		const keyValue = `${key}-value`;

		CyGameDataUtilities.getDataByKey(key, keyValue);
		cy.get(`@${keyValue}`).should("eql", value);
	}
}
