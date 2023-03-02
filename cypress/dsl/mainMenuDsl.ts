import DSL from "./dsl";
import CyGameDataUtilities from "../utils/cyGameDataUtilities";

export default class MainMenuDsl extends DSL {
	confirmSelection() {
		this.makeInput("w");
	}
	goToPlay() {}
	goToOptions() {
		this.makeInput("k");
	}
	goToQuit() {
		this.makeInput("k");
		this.makeInput("k");
	}

	validateCursorIsOnPlay() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__current-cursor-position", "1");
	}
	validateCursorIsOnOptions() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__current-cursor-position", "2");
	}
	validateCursorIsOnQuit() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__current-cursor-position", "3");
	}

	validatePlayButtonWasPressed() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__button-pressed", "1");
	}
	validateOptionsButtonWasPressed() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__button-pressed", "2");
	}
	validateQuitButtonWasPressed() {
		CyGameDataUtilities.validateKeyIsEqualToValue("main-menu__button-pressed", "3");
	}
}
