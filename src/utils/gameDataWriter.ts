export default class GameDataWriter {
	private data: { [key: string]: string } = {};

	constructor(private write: (data: any) => void) {}

	addData(key: string, value: any) {
		if (typeof value !== "string") {
			value = JSON.stringify(value);
		}
		this.data[key] = value;
		this.writeData();
	}

	removeData(key: string) {
		delete this.data[key];
		this.writeData();
	}

	private writeData() {
		this.write(this.data);
	}
}

export class HtmlDataWriter extends GameDataWriter {
	private constructor() {
		super(HtmlDataWriter.writeHtml);
	}
	private static instance: HtmlDataWriter;
	static getInstance(): HtmlDataWriter {
		if (!HtmlDataWriter.instance) {
			HtmlDataWriter.instance = new HtmlDataWriter();
		}
		return HtmlDataWriter.instance;
	}

	private static writeHtml(data: { [key: string]: string }) {
		const gameDataElement = document.getElementById("cy-game-data");
		if (!gameDataElement) {
			throw new Error("Could not find element with id 'cy-game-data'");
		}
		gameDataElement.innerHTML = "";
		for (const key of Object.keys(data)) {
			gameDataElement.appendChild(HtmlDataWriter.createHtmlElement(key, data[key]));
		}
	}

	private static createHtmlElement(key: string, value: string): HTMLDivElement {
		const element = document.createElement("div");
		element.setAttribute("cy-game-data__key", key);
		element.setAttribute("cy-game-data__value", value);
		return element;
	}
}
