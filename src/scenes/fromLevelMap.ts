import GameScene from "./gameScene";
import { SCENE_KEYS } from "../utils/constants";
import { ButtonType } from "../utils/controllerManager";
import { LevelMap, LevelMapMeta, LevelMapTileLayer, ParsedLevelMap, ParsedLevelMapTile } from "../types/levelMap";
import LevelMapParser from "../components/levelMap/levelMapParser";
import PlayerManager from "../components/player/PlayerManager";
import PlayerSpriteManager from "../components/player/PlayerSpriteManager";

const ASSET_KEYS = {
	PLAYER: "player",
	TILESET: "tileset",
	BACKGROUND: "background",
	ENEMY: "enemy",
	LEVEL_MAP: "level map",
};

const LAYER_TYPES = {
	PLAYER: "player",
	ENEMY: "enemy",
	GROUND: "ground",
	VOID: "void",
};

const TILE_SIZE = 32;
export default class FromLevelMap extends GameScene {
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	groundTiles: Phaser.GameObjects.Sprite[] = [];
	enemies: Phaser.GameObjects.Sprite[] = [];
	private playerManager: PlayerManager;

	constructor() {
		super({ key: SCENE_KEYS.FROM_LEVEL_MAP });
	}

	preload() {
		super.preload();
		this.load.spritesheet(ASSET_KEYS.PLAYER, "assets/player.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.TILESET, "assets/tileset.png", { frameHeight: 32, frameWidth: 32 });
		this.load.spritesheet(ASSET_KEYS.ENEMY, "assets/enemy.png", { frameHeight: 32, frameWidth: 32 });
		this.load.image(ASSET_KEYS.BACKGROUND, "assets/background.png");
		this.load.image(ASSET_KEYS.BACKGROUND, "assets/background.png");
		this.load.json(ASSET_KEYS.LEVEL_MAP, "assets/levels/level-1.json");
	}

	create() {
		performance.mark("start");
		this.drawBackground();

		const levelMap = this.cache.json.get(ASSET_KEYS.LEVEL_MAP) as LevelMap;
		const parsedLevelMap = new LevelMapParser(JSON.stringify(levelMap)).getParsedLevelMap();
		this.setWorldBoundsByLevelMap(parsedLevelMap.meta);
		this.drawTilesFromLevelMap(parsedLevelMap);
		performance.mark("end");

		const measurement = performance.measure("draw", "start", "end");
		console.log(measurement);
	}

	private drawBackground() {
		const background = this.add.image(-800, -500, ASSET_KEYS.BACKGROUND);
		background.setOrigin(0, 0);
		background.setScale(3.0, 3.0);
	}

	private setWorldBoundsByLevelMap(levelMapMeta: LevelMapMeta) {
		this.physics.world.setBounds(0, 0, levelMapMeta.width * TILE_SIZE, levelMapMeta.height * TILE_SIZE);
		this.cameras.main.setBounds(0, 0, levelMapMeta.width * TILE_SIZE, levelMapMeta.height * TILE_SIZE);
	}

	private drawTilesFromLevelMap(levelMap: ParsedLevelMap) {
		let currentTile = levelMap.tiles[0][0];

		while (currentTile.tileContext.next) {
			currentTile.layers.forEach(layer => {
				this.drawLayer(currentTile, layer);
			});

			currentTile = currentTile.tileContext.next;
		}
	}

	private drawLayer(tile: ParsedLevelMapTile, layer: LevelMapTileLayer) {
		switch (layer.type) {
			case LAYER_TYPES.GROUND:
				this.spawnGroundTile(tile, layer);
				break;
			case LAYER_TYPES.PLAYER:
				this.spawnPlayer(tile);
				break;
			case LAYER_TYPES.ENEMY:
				this.spawnEnemy(tile, layer);
				break;
			case LAYER_TYPES.VOID:
				break;
		}
	}

	private spawnEnemy(tile: ParsedLevelMapTile, layer: LevelMapTileLayer) {
		const enemy = this.physics.add.sprite(tile.x * TILE_SIZE, tile.y * TILE_SIZE, ASSET_KEYS.ENEMY, 0);
		this.physics.add.existing(enemy);

		enemy.setCollideWorldBounds(true);
		enemy.setBounce(0.2);
		enemy.setGravityY(300);

		this.physics.add.collider(enemy, this.groundTiles);

		this.enemies.push(enemy);
	}

	private spawnGroundTile(tile: ParsedLevelMapTile, layer: LevelMapTileLayer) {
		const groundTile = this.physics.add
			.sprite(tile.x * TILE_SIZE, tile.y * TILE_SIZE, layer.spriteSheetKey, layer.spriteSheetFrame)
			.setOrigin(0, 0);

		groundTile.body.setAllowGravity(false);
		groundTile.body.setImmovable(true);
		groundTile.body.setCollideWorldBounds(true);

		this.groundTiles.push(groundTile);
	}

	private spawnPlayer(tile: ParsedLevelMapTile) {
		this.player = this.physics.add
			.sprite(tile.x * TILE_SIZE, tile.y * TILE_SIZE, ASSET_KEYS.PLAYER)
			.setOrigin(0, 0);
		this.player.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.player);

		const playerSpriteManager = new PlayerSpriteManager(
			this.player.setFrame.bind(this.player),
			this.player.setFlipX.bind(this.player),
		);

		this.playerManager = new PlayerManager(
			this.player.setVelocityX.bind(this.player),
			this.player.setVelocityY.bind(this.player),
			playerSpriteManager,
		);

		this.physics.add.collider(this.player, this.groundTiles, () => {
			this.playerManager.handleGroundTouch();
		});

		this.physics.add.collider(this.player, this.enemies, (p, e) => {
			this.playerManager.handleEnemyTouch(e as any, p, this.time);
		});
	}

	onButtonPress(buttons: ButtonType[]): void {
		if (this.playerManager) this.playerManager.handleButtonPress(buttons, { x: this.player.x, y: this.player.y });
	}

	update(time, delta) {
		super.update(time, delta);

		if (this.player) {
			this.writeDebugData("Player X", this.player.x);
			this.writeDebugData("Player Y", this.player.y);
		}
	}
}
