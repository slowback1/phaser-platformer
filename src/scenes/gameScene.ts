import { HtmlDataWriter } from "../utils/gameDataWriter";
import ControlManager, { ButtonType } from "../utils/controllerManager";

const LOCAL_DOMAINS = ["localhost", "127.0.0.1", "[::1]"];

export default abstract class GameScene extends Phaser.Scene {
	protected constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
		this.registerKeyboardEvents();
		this.registerButtonEventListener();
	}

	protected writeDebugData(key: string, value: any) {
		const isInLocalDomain = LOCAL_DOMAINS.includes(window.location.hostname);

		if (isInLocalDomain) {
			let writer = HtmlDataWriter.getInstance();
			writer.addData(key, value);
		}
	}

	private registerKeyboardEvents() {
		document.addEventListener("keydown", event => {
			this.writeDebugData("key-down", event.key);
			const controlManager = ControlManager.getInstance();
			controlManager.onKeyDown(event);
		});
	}

	private unsubscribeButtonEventListener: () => void;
	private registerButtonEventListener() {
		this.unsubscribeButtonEventListener = ControlManager.getInstance().subscribe(this.onButtonPress.bind(this));
	}

	abstract onButtonPress(button: ButtonType): void;
}
