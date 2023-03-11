import PlayerSpriteManager, { PLAYER_SPRITE_FRAMES } from "./PlayerSpriteManager";
import { Direction } from "../../types";

describe("PlayerSpriteManager", () => {
	let mockOnSpriteChange: jest.Mock;
	let mockFlipSprite: jest.Mock;
	let playerSpriteManager: PlayerSpriteManager;
	beforeEach(() => {
		mockOnSpriteChange = jest.fn();
		mockFlipSprite = jest.fn();
		playerSpriteManager = new PlayerSpriteManager(mockOnSpriteChange, mockFlipSprite);
	});

	it("constructs without breaking", () => {
		expect(playerSpriteManager).toBeTruthy();
		expect(playerSpriteManager).toBeInstanceOf(PlayerSpriteManager);
	});

	it("calls onSpriteChange with the idle sprite when constructed", () => {
		expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.IDLE);
	});
	describe("onWalk", () => {
		it("calls onSpriteChange with the walk sprite when calling the onWalk method", () => {
			playerSpriteManager.onWalk();
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.WALK_1);
		});
		it("calls onSpriteChange with the second walk sprite when calling the onWalk method twice", () => {
			playerSpriteManager.onWalk();
			playerSpriteManager.onWalk();
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.WALK_2);
		});
		it("calls onSpriteChange with the first walk sprite when calling the onWalk method three times", () => {
			playerSpriteManager.onWalk();
			playerSpriteManager.onWalk();
			playerSpriteManager.onWalk();

			const lastCall = mockOnSpriteChange.mock.calls[mockOnSpriteChange.mock.calls.length - 1];
			const arg = lastCall[0];
			expect(arg).toEqual(PLAYER_SPRITE_FRAMES.WALK_1);
		});
	});

	describe("onEnd", () => {
		it("returns the frame to idle when calling the onEnd method", () => {
			playerSpriteManager.onWalk();
			playerSpriteManager.onEnd();

			const lastCall = mockOnSpriteChange.mock.calls[mockOnSpriteChange.mock.calls.length - 1];
			const arg = lastCall[0];
			expect(arg).toEqual(PLAYER_SPRITE_FRAMES.IDLE);
		});
	});

	describe("onJump", () => {
		it("calls onSpriteChange with the jump sprite when calling the onJump method", () => {
			playerSpriteManager.onJump();
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_1);
		});
		it("calls onSpriteChange with the second jump sprite when calling the onJump method twice", () => {
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_2);
		});

		it("calls onSpriteChange with the correct sequence of jumps", () => {
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();

			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_1);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_2);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_3);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_4);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_5);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_6);
			expect(mockOnSpriteChange).toHaveBeenCalledWith(PLAYER_SPRITE_FRAMES.JUMP_7);
		});

		it("keeps calling onSpriteChange with the last jump sprite when calling the onJump method more than 7 times", () => {
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();
			playerSpriteManager.onJump();

			const lastCall = mockOnSpriteChange.mock.calls[mockOnSpriteChange.mock.calls.length - 1];
			const arg = lastCall[0];
			expect(arg).toEqual(PLAYER_SPRITE_FRAMES.JUMP_7);
		});
	});

	describe("onDirectionChange", () => {
		it("calls flipSprite when calling onDirectionChange with a direction of right", () => {
			playerSpriteManager.onDirectionChange(Direction.RIGHT);
			expect(mockFlipSprite).toHaveBeenCalledWith(true);
		});
		it("calls flipSprite when calling onDirectionChange with a direction of left", () => {
			playerSpriteManager.onDirectionChange(Direction.LEFT);
			expect(mockFlipSprite).toHaveBeenCalledWith(false);
		});
	});
});
