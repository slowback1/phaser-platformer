export interface LevelMap {
	meta: LevelMapMeta;
	tiles: LevelMapTile[][];
}

export interface LevelMapMeta {
	key: string;
	name: string;
	width: number;
	height: number;
}

export interface LevelMapTile {
	layers: LevelMapTileLayer[];
}

export interface LevelMapTileLayer {
	type: string;
	spriteSheetKey: string;
	spriteSheetFrame: number;
}

export interface ParsedLevelMap extends LevelMap {
	tiles: ParsedLevelMapTile[][];
}

export interface ParsedLevelMapTile extends LevelMapTile {
	x: number;
	y: number;
	tileContext: ParsedLevelMapTileContext;
}

export interface ParsedLevelMapTileContext {
	top?: ParsedLevelMapTile;
	right?: ParsedLevelMapTile;
	bottom?: ParsedLevelMapTile;
	left?: ParsedLevelMapTile;
	topRight?: ParsedLevelMapTile;
	bottomRight?: ParsedLevelMapTile;
	bottomLeft?: ParsedLevelMapTile;
	topLeft?: ParsedLevelMapTile;
	next?: ParsedLevelMapTile;
	previous?: ParsedLevelMapTile;
}
