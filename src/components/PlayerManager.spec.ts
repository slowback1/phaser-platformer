import PlayerManager from "./PlayerManager";
import { ButtonType } from "../utils/controllerManager";

describe("PlayerManager", () => {
	let player: PlayerManager;
	let velocityXMock: jest.Mock;
	let velocityYMock: jest.Mock;
	beforeEach(() => {
		velocityXMock = jest.fn();
		velocityYMock = jest.fn();
		player = new PlayerManager(velocityXMock, velocityYMock);
	});

	it("can construct without breaking", () => {
		expect(player).toBeDefined();
	});
	it("calls velocityX when pressing the left button", () => {
		player.handleButtonPress(ButtonType.LEFT);
		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
	});
	it("calls velocityX when pressing the right button", () => {
		player.handleButtonPress(ButtonType.RIGHT);
		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBeGreaterThan(0);
	});
	it("calls velocityY when pressing the A button", () => {
		player.handleButtonPress(ButtonType.A);
		expect(velocityYMock).toHaveBeenCalled();
		const argument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
	});
	it("eventually stops moving when pressing the left button", () => {
		player.handleButtonPress(ButtonType.LEFT);
		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
		jest.advanceTimersByTime(1000);
		expect(velocityXMock).toHaveBeenCalled();
		const argument2 = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument2).toBe(0);
	});
});
