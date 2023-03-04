import { Direction } from "../types";

export const PLAYER_SPRITE_FRAMES = {
	IDLE: 0,
	WALK_1: 1,
	WALK_2: 2,
	JUMP_1: 3,
	JUMP_2: 4,
	JUMP_3: 5,
	JUMP_4: 6,
	JUMP_5: 7,
	JUMP_6: 8,
	JUMP_7: 9,
};

export default class PlayerSpriteManager {
	constructor(private onSpriteChange: (frame: number) => void, private flipSprite: (flip: boolean) => void) {
		this.updateFrame(PLAYER_SPRITE_FRAMES.IDLE);
	}

	private updateFrame(frame: number) {
		this.lastFrame = frame;
		this.onSpriteChange(this.lastFrame);
	}

	private lastFrame: number;

	onDirectionChange(direction: string) {
		if (direction === Direction.LEFT) {
			this.flipSprite(false);
		}
		if (direction === Direction.RIGHT) {
			this.flipSprite(true);
		}
	}

	onWalk() {
		if (this.lastFrame === PLAYER_SPRITE_FRAMES.WALK_1) {
			this.updateFrame(PLAYER_SPRITE_FRAMES.WALK_2);
		} else {
			this.updateFrame(PLAYER_SPRITE_FRAMES.WALK_1);
		}
	}

	onEnd() {
		this.updateFrame(PLAYER_SPRITE_FRAMES.IDLE);
	}

	onJump() {
		const jumpFrames: { prev: number; current: number }[] = [
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_1, current: PLAYER_SPRITE_FRAMES.JUMP_2 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_2, current: PLAYER_SPRITE_FRAMES.JUMP_3 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_3, current: PLAYER_SPRITE_FRAMES.JUMP_4 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_4, current: PLAYER_SPRITE_FRAMES.JUMP_5 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_5, current: PLAYER_SPRITE_FRAMES.JUMP_6 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_6, current: PLAYER_SPRITE_FRAMES.JUMP_7 },
			{ prev: PLAYER_SPRITE_FRAMES.JUMP_7, current: PLAYER_SPRITE_FRAMES.JUMP_7 },
		];

		const currentJumpFrame = jumpFrames.find(jumpFrame => jumpFrame.prev === this.lastFrame);
		if (!currentJumpFrame) {
			this.updateFrame(PLAYER_SPRITE_FRAMES.JUMP_1);
			return;
		}
		this.updateFrame(currentJumpFrame.current);
	}
}
