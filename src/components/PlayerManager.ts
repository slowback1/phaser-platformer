import { ButtonType } from "../utils/controllerManager";

export default class PlayerManager {
	constructor(private setVelocityX: (x: number) => void, private setVelocityY: (y: number) => void) {}

	private horizontalVelocity: number = 0;
	private verticalVelocity: number = 0;

	private updateHorizontalVelocity(newVelocity: number) {
		this.horizontalVelocity = newVelocity;
		this.setVelocityX(this.horizontalVelocity);
	}

	handleButtonPress(key: ButtonType) {
		switch (key) {
			case ButtonType.LEFT:
				this.handleHorizontalMovement("left");
				break;
			case ButtonType.RIGHT:
				this.handleHorizontalMovement("right");
				break;
			case ButtonType.A:
				this.setVelocityY(-330);
				break;
		}
	}

	private newHorizontalMovementCalled: boolean;
	private async handleHorizontalMovement(direction: "left" | "right") {
		this.newHorizontalMovementCalled = true;
		if (direction === "left") {
			this.updateHorizontalVelocity(-160);
		} else {
			this.updateHorizontalVelocity(160);
		}
		this.newHorizontalMovementCalled = false;
	}
}
