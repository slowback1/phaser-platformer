import {
	LevelMap,
	LevelMapMeta,
	LevelMapTileLayer,
	ParsedLevelMap,
	ParsedLevelMapTile,
	ParsedLevelMapTileContext,
} from "../../types/levelMap";

export default class LevelMapParser {
	private _levelMap: LevelMap;
	private _parsedLevelMap: ParsedLevelMap;
	constructor(private readonly _sourceJson: string) {
		this.init();
	}
	private init() {
		this.tryParseMapJson();
		this.parseLevelMap();
	}

	private tryParseMapJson() {
		try {
			this._levelMap = JSON.parse(this._sourceJson);
		} catch (e) {
			throw new Error("Invalid JSON");
		}
	}

	private parseLevelMap() {
		this.getParsedLevelMapBase();

		this.validateLevelMapMeta();

		this.setParsedLevelMapTiles();
	}

	private validateLevelMapMeta() {
		if (this._parsedLevelMap.meta.width === 0 || this._parsedLevelMap.meta.height === 0) {
			throw new Error("Map is empty");
		}
		if (this._parsedLevelMap.meta.key === "") {
			throw new Error("Map key is empty");
		}
	}

	private getParsedLevelMapBase() {
		this._parsedLevelMap = {
			meta: this.getLevelMapMeta(),
			tiles: [],
		};
	}

	private getLevelMapMeta(): LevelMapMeta {
		return { ...this._levelMap.meta, width: this.getLongestRowLength(), height: this._levelMap.tiles.length };
	}

	private setParsedLevelMapTiles() {
		this._parsedLevelMap.tiles = this.getParsedTiles();
		this.setTileContexts();
	}

	private getLongestRowLength(): number {
		let longestRowLength = 0;
		for (let y = 0; y < this._levelMap.tiles.length; y++) {
			if (this._levelMap.tiles[y].length > longestRowLength) {
				longestRowLength = this._levelMap.tiles[y].length;
			}
		}
		return longestRowLength;
	}

	private getParsedTiles(): ParsedLevelMapTile[][] {
		const parsedTiles: ParsedLevelMapTile[][] = [];
		for (let y = 0; y < this._parsedLevelMap.meta.height; y++) {
			parsedTiles[y] = [];
			for (let x = 0; x < this._parsedLevelMap.meta.width; x++) {
				parsedTiles[y][x] = {
					x,
					y,
					layers: this.getTileLayers(y, x),
					tileContext: {},
				};
			}
		}
		return parsedTiles;
	}

	private getTileLayers(y: number, x: number): LevelMapTileLayer[] {
		const tile = this._levelMap.tiles[y][x];

		return tile?.layers ?? [{ type: "placeholder", spriteSheetKey: "", spriteSheetFrame: 0 }];
	}

	private setTileContexts() {
		for (let y = 0; y < this._parsedLevelMap.meta.height; y++) {
			for (let x = 0; x < this._parsedLevelMap.meta.width; x++) {
				this._parsedLevelMap.tiles[y][x].tileContext = this.getTileContext(x, y);
			}
		}
	}

	private getTileContext(x: number, y: number): ParsedLevelMapTileContext {
		const tileContext: ParsedLevelMapTileContext = {};
		if (y > 0) {
			tileContext.top = this._parsedLevelMap.tiles[y - 1][x];
		}
		if (x < this._levelMap.meta.width - 1) {
			tileContext.right = this._parsedLevelMap.tiles[y][x + 1];
		}
		if (y < this._levelMap.meta.height - 1) {
			tileContext.bottom = this._parsedLevelMap.tiles[y + 1][x];
		}
		if (x > 0) {
			tileContext.left = this._parsedLevelMap.tiles[y][x - 1];
		}
		if (y > 0 && x < this._levelMap.meta.width - 1) {
			tileContext.topRight = this._parsedLevelMap.tiles[y - 1][x + 1];
		}
		if (y < this._levelMap.meta.height - 1 && x < this._levelMap.meta.width - 1) {
			tileContext.bottomRight = this._parsedLevelMap.tiles[y + 1][x + 1];
		}
		if (y < this._levelMap.meta.height - 1 && x > 0) {
			tileContext.bottomLeft = this._parsedLevelMap.tiles[y + 1][x - 1];
		}
		if (y > 0 && x > 0) {
			tileContext.topLeft = this._parsedLevelMap.tiles[y - 1][x - 1];
		}

		if (tileContext.right) tileContext.next = tileContext.right;
		else if (tileContext.bottom) tileContext.next = this._parsedLevelMap.tiles[y + 1][0];

		if (tileContext.left) tileContext.previous = tileContext.left;
		else if (tileContext.top)
			tileContext.previous = this._parsedLevelMap.tiles[y - 1][this._parsedLevelMap.meta.width - 1];

		return tileContext;
	}

	getParsedLevelMap(): ParsedLevelMap {
		return this._parsedLevelMap;
	}
}
