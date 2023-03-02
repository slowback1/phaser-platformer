import DSL from "./dsl";
import CyGameDataUtilities from "../utils/cyGameDataUtilities";

export default class Level1Dsl extends DSL {
	constructor() {
		super();
		this.makeInput("w");
	}

	moveLeft() {
		cy.wait(500);
		this.makeInput("j");
		cy.wait(250);
	}
	moveRight() {
		cy.wait(500);
		this.makeInput("l");
		cy.wait(250);
	}
	jump(shouldWait: boolean = true) {
		if (shouldWait) cy.wait(1000);
		this.makeInput("z");
	}
	getCurrentPlayerX(alias: string = "current-player-x") {
		CyGameDataUtilities.getDataByKey("player__position-x", alias);
	}

	validatePlayerCanStop() {
		this.moveRight();
		CyGameDataUtilities.getDataByKey("player__position-x", "player-x").then(value => {
			cy.wait(1000);
			CyGameDataUtilities.getDataByKey("player__position-x", "player-x-2");
			cy.get("@player-x-2").should("eql", value);
		});
	}

	validatePlayerCannotDoubleJump() {
		this.jump();
		CyGameDataUtilities.getDataByKey("player__position-y", "player-y").then(value => {
			this.jump(false);
			CyGameDataUtilities.getDataByKey("player__position-y", "player-y-2");
			cy.get("@player-y-2").should("not.eql", value);
		});
	}

	validatePlayerPositionIsGreaterThan(x: number) {
		CyGameDataUtilities.validateKeyIsGreaterThanValue("player__position-x", x);
	}
	validatePlayerPositionIsLessThan(x: number) {
		CyGameDataUtilities.validateKeyIsLessThanValue("player__position-x", x);
	}
	validatePositionIsHigherThan(y: number) {
		CyGameDataUtilities.validateKeyIsGreaterThanValue("player__position-y", y);
	}
}
