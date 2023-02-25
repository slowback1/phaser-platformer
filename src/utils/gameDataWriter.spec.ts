import GameDataWriter from "./gameDataWriter";

describe("GameDataWriter", () => {
	let gameDataWriter: GameDataWriter;
	let writeMock: jest.Mock;
	beforeEach(() => {
		writeMock = jest.fn();
		gameDataWriter = new GameDataWriter(writeMock);
	});
	const getLastCall = () => writeMock.mock.lastCall[0];

	describe("addData", () => {
		it("writes the newly added data", () => {
			gameDataWriter.addData("key", "value");
			expect(getLastCall()).toEqual({ key: "value" });
		});
		it("writes the newly added data and the existing data", () => {
			gameDataWriter.addData("key1", "value1");
			gameDataWriter.addData("key2", "value2");
			expect(getLastCall()).toEqual({ key1: "value1", key2: "value2" });
		});
		it("overwrites the existing data", () => {
			gameDataWriter.addData("key1", "value1");
			gameDataWriter.addData("key1", "value2");
			expect(getLastCall()).toEqual({ key1: "value2" });
		});

		it("stringifies the data if it is not a string", () => {
			gameDataWriter.addData("key1", { value: "value1" });
			expect(getLastCall()).toEqual({ key1: '{"value":"value1"}' });
		});
	});
	describe("removeData", () => {
		beforeEach(() => {
			gameDataWriter.addData("key1", "value1");
			gameDataWriter.addData("key2", "value2");
		});

		it("removes the data", () => {
			gameDataWriter.removeData("key1");
			expect(getLastCall()).toEqual({ key2: "value2" });
		});
		it("does nothing if the data does not exist", () => {
			gameDataWriter.removeData("key3");
			expect(getLastCall()).toEqual({ key1: "value1", key2: "value2" });
		});
	});
});
