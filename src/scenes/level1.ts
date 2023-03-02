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

	onButtonPress(buttons: ButtonType[]): void {
		this.playerManager.handleButtonPress(buttons, { x: this.player.x, y: this.player.y });
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
		this.spawnEnemy();
	}
	groundTiles: Phaser.GameObjects.Sprite[] = [];
	drawGroundTilesFromStartToFinish() {
		for (let i = 0; i < 50; i++) {
			const sprite = this.add.sprite(32 * i, 480 - 32, ASSET_KEYS.GROUND_TILES, 0);
			this.physics.add.existing(sprite);

			(sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
			(sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);

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

		this.physics.add.collider(this.player, this.groundTiles, () => {
			this.playerManager.handleGroundTouch();
		});

		this.playerManager = new PlayerManager(
			this.player.setVelocityX.bind(this.player),
			this.player.setVelocityY.bind(this.player),
		);
	}

	spawnEnemy() {
		const enemy = this.physics.add.sprite(32 * 5, 480 - 128, ASSET_KEYS.ENEMY);
		enemy.setCollideWorldBounds(true);
		enemy.setBounce(0.2);
		enemy.setGravityY(300);

		this.physics.add.collider(enemy, this.groundTiles);
		this.physics.add.collider(enemy, this.player, (e, p) => {
			if (this.player.y < enemy.y) {
				enemy.setFrame(1);
				enemy.body.checkCollision.none = true;
				enemy.setGravityY(0);
				this.time.delayedCall(1000, () => {
					e.destroy();
				});
			}
		});
	}

	update(time, delta) {
		super.update(time, delta);
		this.writeDebugData("player__position-x", this.player.x);
		this.writeDebugData("player__position-y", this.player.y);
	}
}
