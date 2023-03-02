import { ButtonType } from "../utils/controllerManager";
import hasButton from "../utils/hasButton";
import { Point } from "../types";

export default class PlayerManager {
	private readonly INITIAL_HORIZONTAL_VELOCITY: number = 180;
	private readonly INITIAL_VERTICAL_VELOCITY: number = -200;
	private readonly HORIZONTAL_TAPER: number = 50;
	private readonly VERTICAL_TAPER: number = 25;
	private readonly MAX_JUMP_HEIGHT: number = 100;

	constructor(private setVelocityX: (x: number) => void, private setVelocityY: (y: number) => void) {}

	private horizontalVelocity: number = 0;
	private verticalVelocity: number = 0;
	private currentDirection: "left" | "right" = "right";

	handleButtonPress(keys: ButtonType[], position: Point) {
		let hasHorizontalMovement = false;
		let hasVerticalMovement = false;

		if (hasButton(keys, ButtonType.LEFT)) {
			this.handleHorizontalMovement("left");
			hasHorizontalMovement = true;
		} else if (hasButton(keys, ButtonType.RIGHT)) {
			this.handleHorizontalMovement("right");
			hasHorizontalMovement = true;
		}
		if (hasButton(keys, ButtonType.A) && (!this.hasJumped || this.continueJump)) {
			this.handleJump(position);
			hasVerticalMovement = true;
		}

		if (!hasHorizontalMovement) {
			this.taperHorizontalVelocity();
		}
		if (!hasVerticalMovement) {
			this.taperVerticalVelocity();
			this.continueJump = false;
		}
	}

	handleGroundTouch() {
		this.hasJumped = false;
		this.continueJump = false;
	}

	private hasJumped: boolean = false;
	private continueJump: boolean = false;
	private originPoint: Point = { x: 0, y: 0 };
	private handleJump(position: Point) {
		if (!this.hasJumped) {
			this.originPoint = position;
			this.hasJumped = true;
		}

		const distance = this.originPoint.y - position.y;
		if (distance <= this.MAX_JUMP_HEIGHT) {
			this.continueJump = true;
			this.updateVerticalVelocity(this.INITIAL_VERTICAL_VELOCITY);
		} else {
			this.continueJump = false;
			this.taperVerticalVelocity();
		}
	}

	private updateHorizontalVelocity(newVelocity: number) {
		this.horizontalVelocity = newVelocity;
		this.setVelocityX(this.horizontalVelocity);
	}
	private updateVerticalVelocity(newVelocity: number) {
		this.verticalVelocity = newVelocity;
		this.setVelocityY(this.verticalVelocity);
	}

	private taperVerticalVelocity() {
		let velocity = Math.max(this.verticalVelocity - this.VERTICAL_TAPER, -this.INITIAL_VERTICAL_VELOCITY);

		this.updateVerticalVelocity(velocity);
	}
	private taperHorizontalVelocity() {
		let velocity = this.horizontalVelocity;
		if (velocity > 0) {
			velocity = Math.max(this.horizontalVelocity - this.HORIZONTAL_TAPER, 0);
		} else {
			velocity = Math.min(this.horizontalVelocity + this.HORIZONTAL_TAPER, 0);
		}
		this.updateHorizontalVelocity(velocity);
	}
	private handleHorizontalMovement(direction: "left" | "right") {
		this.currentDirection = direction;
		if (direction === "left") {
			this.updateHorizontalVelocity(-this.INITIAL_HORIZONTAL_VELOCITY);
		} else {
			this.updateHorizontalVelocity(this.INITIAL_HORIZONTAL_VELOCITY);
		}
	}
}
