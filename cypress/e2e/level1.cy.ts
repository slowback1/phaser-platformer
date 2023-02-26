import Level1Dsl from "../dsl/level1Dsl";
import CyGameDataUtilities from "../utils/cyGameDataUtilities";

describe("Level 1", () => {
	let pageObject: Level1Dsl;
	beforeEach(() => {
		pageObject = new Level1Dsl();
	});

	it("should load the level", () => {
		pageObject.validateIsOnRightScreen("Level1");
	});
	it("can move the player left", () => {
		pageObject.moveLeft();
		pageObject.validatePlayerPositionIsLessThan(32);
	});
	it("can move the player right", () => {
		pageObject.moveRight();
		pageObject.validatePlayerPositionIsGreaterThan(32);
	});
	it("the player stops moving after not pressing the right button for one second", () => {
		pageObject.validatePlayerCanStop();
	});
});
