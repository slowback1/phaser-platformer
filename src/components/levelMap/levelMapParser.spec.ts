import { LevelMap } from "../../types/levelMap";
import LevelMapParser from "./levelMapParser";

const testMap: LevelMap = {
	meta: {
		key: "test",
		name: "Test Map",
		width: 3,
		height: 3,
	},
	tiles: [
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
	],
};
const testDirtyMap: LevelMap = {
	meta: {
		key: "test",
		name: "Test Dirty Map",
		width: 7,
		height: 2,
	},
	tiles: [
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
		[
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 0,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 1,
					},
				],
			},
			{
				layers: [
					{
						type: "background",
						spriteSheetKey: "test",
						spriteSheetFrame: 2,
					},
				],
			},
		],
	],
};

const testMapString = JSON.stringify(testMap);
const testDirtyMapString = JSON.stringify(testDirtyMap);

describe("LevelMapParser", () => {
	let mapParser: LevelMapParser;

	describe("clean map", () => {
		beforeEach(() => {
			mapParser = new LevelMapParser(testMapString);
		});

		it("construct without breaking", () => {
			expect(mapParser).toBeDefined();
		});

		it("can return the parsed map", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap).toBeDefined();
		});

		it("parsed map has the same meta as the original when the original did not have any faults", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.meta).toEqual(testMap.meta);
		});

		it("parsed map has the same number of tile rows as the original", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.tiles.length).toEqual(testMap.tiles.length);
		});

		it("the first parsed tile has the same x and y as the original", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.tiles[0][0].x).toEqual(0);
			expect(parsedMap.tiles[0][0].y).toEqual(0);
		});

		it("populates the tile context for the middle tile with every tile around it", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const middleTile = parsedMap.tiles[1][1];
			expect(middleTile.tileContext.top).toBeDefined();
			expect(middleTile.tileContext.right).toBeDefined();
			expect(middleTile.tileContext.bottom).toBeDefined();
			expect(middleTile.tileContext.left).toBeDefined();
			expect(middleTile.tileContext.topRight).toBeDefined();
			expect(middleTile.tileContext.bottomRight).toBeDefined();
			expect(middleTile.tileContext.bottomLeft).toBeDefined();
			expect(middleTile.tileContext.topLeft).toBeDefined();
		});

		it("populates the tile context for the top left tile with every tile around it", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const topLeftTile = parsedMap.tiles[0][0];
			expect(topLeftTile.tileContext.top).toBeUndefined();
			expect(topLeftTile.tileContext.right).toBeDefined();
			expect(topLeftTile.tileContext.bottom).toBeDefined();
			expect(topLeftTile.tileContext.left).toBeUndefined();
			expect(topLeftTile.tileContext.topRight).toBeUndefined();
			expect(topLeftTile.tileContext.bottomRight).toBeDefined();
			expect(topLeftTile.tileContext.bottomLeft).toBeUndefined();
			expect(topLeftTile.tileContext.topLeft).toBeUndefined();
		});

		it("populates the 'next' property of the tile context for the top left tile with the tile to the right", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const topLeftTile = parsedMap.tiles[0][0];
			expect(topLeftTile.tileContext.next).toEqual(topLeftTile.tileContext.right);
		});

		it("populates the 'next' property of the tile context for the top right tile with the leftmost tile of the next row", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const topRightTile = parsedMap.tiles[0][2];
			expect(topRightTile.tileContext.next).toEqual(parsedMap.tiles[1][0]);
		});
		it("populates the 'previous' property of the tile context for the top right tile with the tile to the left", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const topRightTile = parsedMap.tiles[0][2];
			expect(topRightTile.tileContext.previous).toEqual(topRightTile.tileContext.left);
		});
		it("populates the 'previous property of the tile context for the bottom left tile with the rightmost tile of the previous row", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			const bottomLeftTile = parsedMap.tiles[2][0];
			expect(bottomLeftTile.tileContext.previous).toEqual(parsedMap.tiles[1][2]);
		});
	});

	describe("dirty map", () => {
		beforeEach(() => {
			mapParser = new LevelMapParser(testDirtyMapString);
		});

		it("corrects the meta width and height to match the actual width and height of the map", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.meta.width).toEqual(4);
			expect(parsedMap.meta.height).toEqual(3);
		});

		it("corrects the tile x and y with the correct values", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.tiles[0][0].x).toEqual(0);
			expect(parsedMap.tiles[0][0].y).toEqual(0);
		});

		it("fills in the missing tiles with empty tiles", () => {
			const parsedMap = mapParser.getParsedLevelMap();
			expect(parsedMap.tiles[1][3].layers[0].type).toEqual("placeholder");
			expect(parsedMap.tiles[1][3].layers[0].spriteSheetKey).toEqual("");
			expect(parsedMap.tiles[1][3].layers[0].spriteSheetFrame).toEqual(0);
		});
	});

	describe("absolute doodoo garbage maps", () => {
		it("throws an error when the map does not have any tiles", () => {
			const tileLessMap: LevelMap = {
				meta: {
					key: "awful",
					name: "Awful Map",
					width: 7,
					height: 2,
				},
				tiles: [],
			};
			const tileLessMapString = JSON.stringify(tileLessMap);
			expect(() => new LevelMapParser(tileLessMapString)).toThrowError("Map is empty");
		});

		it("throws an error when not given valid json", () => {
			expect(() => new LevelMapParser("awful")).toThrowError("Invalid JSON");
		});
		it("throws an error when key is blank", () => {
			const badMap = { ...testMap };
			badMap.meta.key = "";
			const badMapString = JSON.stringify(badMap);
			expect(() => new LevelMapParser(badMapString)).toThrowError("Map key is empty");
		});
	});
});
