const fs = require("fs");

function writeJson(json) {
	fs.writeFile("level.json", json, "utf8", err => {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});
}
const NUMBER_OF_ROWS = 24;
const NUMBER_OF_COLUMNS = 240;

function createLevel() {
	const level = {
		meta: {
			key: "level",
			name: "Level",
			width: NUMBER_OF_COLUMNS,
			height: NUMBER_OF_ROWS,
		},
		tiles: createTiles(),
	};

	return level;
}

function createTiles() {
	const tiles = [];
	for (let i = 0; i < NUMBER_OF_ROWS; i++) {
		let row = [];
		for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
			row.push(createTile(i === NUMBER_OF_ROWS - 1, j));
		}
		tiles.push(row);
	}
	return tiles;
}

function createTile(isLastRow = false, rowIndex = 0) {
	return {
		layers: [createLayer(isLastRow, rowIndex)],
	};
}

function createLayer(isLastRow = false, rowIndex = 0) {
	const getSpriteSheetFrame = () => (rowIndex % 2 === 0 ? 0 : 1);

	if (isLastRow) return { type: "ground", spriteSheetFrame: getSpriteSheetFrame(), spriteSheetKey: "tileset" };

	return { type: "void", spriteSheetKey: "", spriteSheetFrame: 0 };
}

const level = createLevel();
writeJson(JSON.stringify(level));
