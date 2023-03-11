import { HtmlDataWriter } from "../utils/gameDataWriter";
import ControlManager, { ButtonType } from "../utils/controllerManager";

const LOCAL_DOMAINS = ["localhost", "127.0.0.1", "[::1]"];

export default abstract class GameScene extends Phaser.Scene {
	protected screenWidth: number;
	protected screenHeight: number;

	protected constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
	}

	protected writeDebugData(key: string, value: any) {
		const isInLocalDomain = LOCAL_DOMAINS.includes(window.location.hostname);

		if (isInLocalDomain) {
			let writer = HtmlDataWriter.getInstance();
			writer.addData(key, value);
		}
	}

	preload() {
		this.registerButtonEventListener();
		ControlManager.getInstance().createKeys(this.input);

		if (this.scene.key) this.writeDebugData("global__current-screen", this.scene.key);
		this.screenWidth = this.scale.game.scale.width;
		this.screenHeight = this.scale.game.scale.height;
		this.writeDebugData("global__screen-width", this.screenWidth);
		this.writeDebugData("global__screen-height", this.screenHeight);
	}

	private unsubscribeButtonEventListener: () => void;
	private registerButtonEventListener() {
		this.unsubscribeButtonEventListener = ControlManager.getInstance().subscribe(this.onButtonPress.bind(this));
	}

	update(time, delta) {
		super.update(time, delta);
		ControlManager.getInstance().cyclePhaserKeys();
	}

	destroy() {
		this.unsubscribeButtonEventListener();
	}

	abstract onButtonPress(buttons: ButtonType[]): void;
}
