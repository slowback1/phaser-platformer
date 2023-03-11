import GameScene from "./gameScene";
import { AssetKeyConfig } from "../types";
import { SCENE_KEYS } from "../utils/constants";
import ControlManager, { ButtonType } from "../utils/controllerManager";

type CursorPosition = 1 | 2 | 3;

const ASSET_KEYS: AssetKeyConfig = {
	MENU_BOX: "menu-box",
};

export default class MainMenu extends GameScene {
	private currentCursorPosition: CursorPosition;

	private updateCursorPosition(newCursorPosition: CursorPosition) {
		this.currentCursorPosition = newCursorPosition;
		this.writeDebugData("main-menu__current-cursor-position", this.currentCursorPosition);
		this.updateDrawnMenuItems();
	}

	constructor() {
		super({
			key: SCENE_KEYS.MAIN_MENU,
		});
	}

	create() {
		this.updateDrawnMenuItems();
	}

	private menuItems: Phaser.GameObjects.Image[] = [];

	updateDrawnMenuItems() {
		if (this.menuItems.length > 0) {
			this.menuItems.forEach(item => item.destroy());
		}

		const playButton = this.makeButton("Play", 1);
		const optionsButton = this.makeButton("Options", 2);
		const quitButton = this.makeButton("Quit", 3);

		this.menuItems = [playButton, optionsButton, quitButton];
	}

	private makeButton(text: string, position: CursorPosition) {
		const { width, height } = this.scale;

		const frame = position === this.currentCursorPosition ? 1 : 0;

		const button = this.add.image(width / 2, (height / 12) * position * 2, ASSET_KEYS.MENU_BOX, frame);
		this.add
			.text(button.x, button.y, text, {
				fontSize: "28px",
				color: "#fff",
				align: "center",
			})
			.setOrigin(0.5, 0.5);
		button.setScale(5);
		return button;
	}

	init() {
		this.updateCursorPosition(1);
	}

	onButtonPress(buttons: ButtonType[]) {
		this.writeDebugData("main-menu__buttons-pressed", buttons.join(", "));
		buttons.forEach(button => {
			switch (button) {
				case ButtonType.UP:
					this.updateCursorPosition(this.getPreviousCursorPosition());
					break;
				case ButtonType.DOWN:
					this.updateCursorPosition(this.getNextCursorPosition());
					break;
				case ButtonType.START:
					this.confirmMenuSelection();
					break;
			}
		});
	}

	confirmMenuSelection() {
		this.writeDebugData("main-menu__button-pressed", this.currentCursorPosition);

		switch (this.currentCursorPosition) {
			case 1:
				this.scene.start(SCENE_KEYS.LEVEL_1);
				break;
		}
	}

	preload() {
		super.preload();
		this.load.spritesheet(ASSET_KEYS.MENU_BOX, "assets/menu-box.png", {
			frameHeight: 32,
			frameWidth: 32,
		});
		this.scene.start(SCENE_KEYS.LEVEL_1);
	}

	private getPreviousCursorPosition(): CursorPosition {
		let value = this.currentCursorPosition - 1;
		if (value < 1) {
			value = 3;
		}
		return value as CursorPosition;
	}
	private getNextCursorPosition(): CursorPosition {
		let value = this.currentCursorPosition + 1;
		if (value > 3) {
			value = 1;
		}
		return value as CursorPosition;
	}

	update(time, delta) {
		super.update(time, delta);
	}
}
