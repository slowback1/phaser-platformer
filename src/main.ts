import "./style.scss";
import "phaser";
import MainMenu from "./scenes/mainMenu";

const windowWidth = window.innerWidth - 450;
const windowHeight = window.innerHeight - 450;

const GameConfig: Phaser.Types.Core.GameConfig = {
	title: "Example Game",
	width: windowWidth,
	height: windowHeight,
	type: Phaser.AUTO,
	parent: "app",
	scene: [MainMenu] as Phaser.Types.Scenes.SettingsConfig[],
	input: {
		keyboard: true,
	},
	backgroundColor: "#000",
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		fullscreenTarget: "app",
		expandParent: false,
	},
	canvasStyle: "margin: 0; padding: 0;",
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
			gravity: { y: 0 },
		},
	},
	version: "debug",
};

export class Game extends Phaser.Game {
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}
}

window.addEventListener("load", () => {
	const game = new Game(GameConfig);
});
