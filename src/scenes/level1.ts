import GameScene from "./gameScene";
import { ButtonType } from "../utils/controllerManager";
import { SCENE_KEYS } from "../utils/constants";
import PlayerManager from "../components/player/PlayerManager";
import { TileSetKeys } from "../utils/TileSetKeys";
import PlayerSpriteManager from "../components/player/PlayerSpriteManager";

const ASSET_KEYS = {
	PLAYER: "player",
	TILESET: "tileset",
	BACKGROUND: "background",
	ENEMY: "enemy",
};
const bottomOfScreen = 999999;

export default class Level1 extends GameScene {
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	constructor() {
		super({ key: SCENE_KEYS.LEVEL_1 });

		//set map size
	}

	onButtonPress(buttons: ButtonType[]): void {
		this.playerManager.handleButtonPress(buttons, { x: this.player.x, y: this.player.y });
	}

	preload() {
		super.preload();
		this.load.spritesheet(ASSET_KEYS.PLAYER, "assets/player.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.TILESET, "assets/tileset.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.ENEMY, "assets/enemy.png", { frameHeight: 32, frameWidth: 32 });
		this.load.image(ASSET_KEYS.BACKGROUND, "assets/background.png");
	}

	create() {
		this.drawBackground();

		this.drawGroundTilesFromStartToFinish();
		this.spawnPlayer();
		this.spawnEnemy();
	}

	private drawBackground() {
		const background = this.add.image(0, 0, ASSET_KEYS.BACKGROUND);
		background.setOrigin(0, 0);
		background.setScale(2.9, 1.2);
	}

	groundTiles: Phaser.GameObjects.Sprite[] = [];
	private drawGroundTilesFromStartToFinish() {
		const tileFrames: { xOffset: number; yOffset: number; frame: number }[] = [
			{ xOffset: 0, yOffset: 0, frame: TileSetKeys.GREEN_TILE_TOP_1 },
			{ xOffset: 1, yOffset: 0, frame: TileSetKeys.GREEN_TILE_TOP_2 },
			{ xOffset: 0, yOffset: 1, frame: TileSetKeys.GREEN_TILE_BOTTOM_1 },
			{ xOffset: 1, yOffset: 1, frame: TileSetKeys.GREEN_TILE_BOTTOM_2 },
		];

		for (let i = 0; i < 500; i++) {
			for (let j = 0; j < tileFrames.length; j++) {
				const { yOffset, xOffset, frame } = tileFrames[j];

				const sprite = this.add.sprite(32 * (i + xOffset), bottomOfScreen, ASSET_KEYS.TILESET, frame);
				this.physics.add.existing(sprite);

				(sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
				(sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);

				(sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

				this.groundTiles.push(sprite);
			}
		}
	}
	private playerManager: PlayerManager;

	private spawnPlayer() {
		this.player = this.physics.add.sprite(32, bottomOfScreen - 32, ASSET_KEYS.PLAYER);
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(0.2);
		this.player.setGravityY(300);

		this.cameras.main.startFollow(this.player);

		this.physics.add.collider(this.player, this.groundTiles, () => {
			this.playerManager.handleGroundTouch();
		});
		const playerSpriteManager = new PlayerSpriteManager(
			this.player.setFrame.bind(this.player),
			this.player.setFlipX.bind(this.player),
		);

		this.playerManager = new PlayerManager(
			this.player.setVelocityX.bind(this.player),
			this.player.setVelocityY.bind(this.player),
			playerSpriteManager,
		);
	}

	private spawnEnemy() {
		const enemy = this.physics.add.sprite(32 * 5, bottomOfScreen - 32, ASSET_KEYS.ENEMY, 0);
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
