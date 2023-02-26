import GameScene from "./gameScene";
import { ButtonType } from "../utils/controllerManager";
import { SCENE_KEYS } from "../utils/constants";
import PlayerManager from "../components/PlayerManager";

const ASSET_KEYS = {
	PLAYER: "player",
	ENEMY: "enemy",
	GROUND_TILES: "groundTiles",
};

export default class Level1 extends GameScene {
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	constructor() {
		super({ key: SCENE_KEYS.LEVEL_1 });
	}

	onButtonPress(button: ButtonType): void {
		this.playerManager.handleButtonPress(button);
	}

	preload() {
		super.preload();
		this.load.spritesheet(ASSET_KEYS.PLAYER, "assets/player.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.ENEMY, "assets/enemy.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.GROUND_TILES, "assets/ground-tiles.png", { frameHeight: 32, frameWidth: 32 });
	}

	create() {
		this.drawGroundTilesFromStartToFinish();
		this.spawnPlayer();
	}
	groundTiles: Phaser.GameObjects.Sprite[] = [];
	drawGroundTilesFromStartToFinish() {
		//draw 25 tiles from the ground tiles sprite sheet across the bottom of the screen
		for (let i = 0; i < 50; i++) {
			const sprite = this.add.sprite(32 * i, 480 - 32, ASSET_KEYS.GROUND_TILES, 0);
			//add collision to the sprite
			this.physics.add.existing(sprite);
			//set the sprite to be static so it doesn't move when the player collides with it

			(sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
			(sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);

			//set the sprite so that the player can use it as ground
			(sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
			this.groundTiles.push(sprite);
		}
	}
	private playerManager: PlayerManager;
	spawnPlayer() {
		this.player = this.physics.add.sprite(32, 480 - 128, ASSET_KEYS.PLAYER);
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(0.2);
		this.player.setGravityY(300);

		this.physics.add.collider(this.player, this.groundTiles);

		this.playerManager = new PlayerManager(
			this.player.setVelocityX.bind(this.player),
			this.player.setVelocityY.bind(this.player),
		);
	}

	update() {
		this.writeDebugData("player__position-x", this.player.x);
		this.writeDebugData("player__position-y", this.player.y);
	}
}
