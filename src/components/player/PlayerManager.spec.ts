import PlayerManager from "./PlayerManager";
import PlayerSpriteManager from "./PlayerSpriteManager";
import { ButtonType } from "../../utils/controllerManager";

describe("PlayerManager", () => {
	let player: PlayerManager;
	let velocityXMock: jest.Mock;
	let velocityYMock: jest.Mock;
	let onWalkMock: jest.Mock;
	let onJumpMock: jest.Mock;
	let onEndMock: jest.Mock;
	let onDirectionMock: jest.Mock;
	beforeEach(() => {
		velocityXMock = jest.fn();
		velocityYMock = jest.fn();

		onWalkMock = jest.fn();
		onJumpMock = jest.fn();
		onEndMock = jest.fn();
		onDirectionMock = jest.fn();

		let mockPlayerSpriteManager: PlayerSpriteManager;

		mockPlayerSpriteManager = new PlayerSpriteManager(jest.fn(), jest.fn());
		mockPlayerSpriteManager.onWalk = onWalkMock;
		mockPlayerSpriteManager.onJump = onJumpMock;
		mockPlayerSpriteManager.onEnd = onEndMock;
		mockPlayerSpriteManager.onDirectionChange = onDirectionMock;

		player = new PlayerManager(velocityXMock, velocityYMock, mockPlayerSpriteManager);
	});

	it("can construct without breaking", () => {
		expect(player).toBeDefined();
	});
	it("calls velocityX when pressing the left button", () => {
		player.handleButtonPress([ButtonType.LEFT], { x: 0, y: 0 });
		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
	});
	it("calls velocityX when pressing the right button", () => {
		player.handleButtonPress([ButtonType.RIGHT], { x: 0, y: 0 });
		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBeGreaterThan(0);
	});
	it("calls velocityY when pressing the A button", () => {
		player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
		expect(velocityYMock).toHaveBeenCalled();
		const argument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
	});
	it("eventually stops moving when pressing the left button", () => {
		player.handleButtonPress([ButtonType.LEFT], { x: 0, y: 0 });
		player.handleButtonPress([], { x: 0, y: 0 });
		player.handleButtonPress([], { x: 0, y: 0 });
		player.handleButtonPress([], { x: 0, y: 0 });
		player.handleButtonPress([], { x: 0, y: 0 });

		expect(velocityXMock).toHaveBeenCalled();
		const argument = velocityXMock.mock.calls[velocityXMock.mock.calls.length - 1][0];
		expect(argument).toBe(0);
	});
	it("does not allow the player to jump higher than the max jump height", () => {
		player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
		player.handleButtonPress([ButtonType.A], { x: 0, y: 120 });
		player.handleButtonPress([ButtonType.A], { x: 0, y: 240 });
		player.handleButtonPress([ButtonType.A], { x: 0, y: 300 });

		expect(velocityYMock).toHaveBeenCalled();
		const argument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];
		expect(argument).toBeLessThan(0);
	});
	it("does not allow the player to jump again while in the air", () => {
		player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
		const firstArgument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];

		player.handleButtonPress([], { x: 0, y: 120 });
		player.handleButtonPress([ButtonType.A], { x: 0, y: 120 });

		expect(velocityYMock).toHaveBeenCalled();
		const secondArgument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];
		expect(secondArgument).toBeGreaterThan(firstArgument);
	});
	it("allows the player to jump again after landing", () => {
		player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
		const firstArgument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];

		player.handleButtonPress([], { x: 0, y: 120 });
		player.handleGroundTouch();
		player.handleButtonPress([ButtonType.A], { x: 0, y: 120 });

		expect(velocityYMock).toHaveBeenCalled();
		const secondArgument = velocityYMock.mock.calls[velocityYMock.mock.calls.length - 1][0];
		expect(secondArgument).toEqual(firstArgument);
	});

	describe("player sprite management", () => {
		it("calls onWalk when pressing the left button", () => {
			player.handleButtonPress([ButtonType.LEFT], { x: 0, y: 0 });
			expect(onWalkMock).toHaveBeenCalled();
		});
		it("calls onWalk when pressing the right button", () => {
			player.handleButtonPress([ButtonType.RIGHT], { x: 0, y: 0 });
			expect(onWalkMock).toHaveBeenCalled();
		});
		it("calls onJump when pressing the A button", () => {
			player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
			expect(onJumpMock).toHaveBeenCalled();
		});

		it("calls onDirectionChange when pressing the left button", () => {
			player.handleButtonPress([ButtonType.LEFT], { x: 0, y: 0 });
			expect(onDirectionMock).toHaveBeenCalled();
		});
		it("calls onDirectionChange when pressing the right button", () => {
			player.handleButtonPress([ButtonType.RIGHT], { x: 0, y: 0 });
			expect(onDirectionMock).toHaveBeenCalled();
		});
		it("continues calling onJump after releasing the A button but before touching the ground", () => {
			player.handleButtonPress([ButtonType.A], { x: 0, y: 0 });
			player.handleButtonPress([], { x: 0, y: 10 });
			expect(onJumpMock).toHaveBeenCalledTimes(2);
		});

		it("calls onEnd when not pressing any buttons", () => {
			player.handleButtonPress([], { x: 0, y: 0 });
			expect(onEndMock).toHaveBeenCalled();
		});
	});
});
