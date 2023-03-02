import hasButton from "./hasButton";
import { ButtonType } from "./controllerManager";

describe("hasButton", () => {
	it("should return true if the button is in the array", () => {
		expect(hasButton([ButtonType.LEFT, ButtonType.RIGHT], ButtonType.LEFT)).toBe(true);
	});
	it("should return false if the button is not in the array", () => {
		expect(hasButton([ButtonType.LEFT, ButtonType.RIGHT], ButtonType.A)).toBe(false);
	});
});
