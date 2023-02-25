import MainMenuDsl from "../dsl/mainMenuDsl";

describe("Main Menu", () => {
	let pageObject: MainMenuDsl;
	beforeEach(() => {
		pageObject = new MainMenuDsl();
	});

	it("defaults the cursor to the play button", () => {
		pageObject.goToPlay();
		pageObject.validateCursorIsOnPlay();
	});
	it("can move the cursor to the options button", () => {
		pageObject.goToOptions();
		pageObject.validateCursorIsOnOptions();
	});
	it("can move the cursor to the quit button", () => {
		pageObject.goToQuit();
		pageObject.validateCursorIsOnQuit();
	});

	it("can press the play button", () => {
		pageObject.goToPlay();
		pageObject.confirmSelection();
		pageObject.validatePlayButtonWasPressed();
	});
	it("can press the options button", () => {
		pageObject.goToOptions();
		pageObject.confirmSelection();
		pageObject.validateOptionsButtonWasPressed();
	});
	it("can press the quit button", () => {
		pageObject.goToQuit();
		pageObject.confirmSelection();
		pageObject.validateQuitButtonWasPressed();
	});
});
