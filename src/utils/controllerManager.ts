import { isKeyObject } from "util/types";

export enum ButtonType {
	A = "A",
	B = "B",
	X = "X",
	Y = "Y",
	UP = "UP",
	DOWN = "DOWN",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	START = "START",
	SELECT = "SELECT",
	L = "L",
	R = "R",
}

const buttonMap: { [key: string]: ButtonType } = {
	j: ButtonType.LEFT,
	l: ButtonType.RIGHT,
	i: ButtonType.UP,
	k: ButtonType.DOWN,
	z: ButtonType.A,
	x: ButtonType.B,
	a: ButtonType.X,
	s: ButtonType.Y,
	q: ButtonType.SELECT,
	w: ButtonType.START,
	e: ButtonType.L,
	r: ButtonType.R,
};

type subscription = { func: (buttons: ButtonType[]) => void; key: number };

export default class ControlManager {
	private static instance: ControlManager;
	private keys: Phaser.Input.Keyboard.Key[];
	static getInstance(): ControlManager {
		if (!ControlManager.instance) {
			ControlManager.instance = new ControlManager();
		}
		return ControlManager.instance;
	}

	private constructor() {}

	private subscribers: subscription[] = [];
	private currentSeed: number = 0;

	subscribe(subscriber: (button: ButtonType[]) => void): () => void {
		this.subscribers.push({ func: subscriber, key: ++this.currentSeed });
		const key = this.currentSeed;
		return () => {
			this.subscribers = this.subscribers.filter(s => s.key !== key);
		};
	}
	getSubscriptions(): ((buttons: ButtonType[]) => void)[] {
		return this.subscribers.map(s => s.func);
	}
	clearSubscriptions() {
		this.subscribers = [];
	}
	onKeyDown(event: KeyboardEvent) {
		const button = buttonMap[event.key];
		if (button) {
			this.notifySubscribers([button]);
		}
	}
	createKeys(input: Phaser.Input.InputPlugin): void {
		const keys: Phaser.Input.Keyboard.Key[] = [];
		for (const key in buttonMap) {
			let keyObject = input.keyboard.addKey(key);
			keys.push(keyObject);
		}
		this.keys = keys;
	}

	cyclePhaserKeys() {
		const buttons: ButtonType[] = [];
		this.keys.forEach(key => {
			if (key.isDown) {
				buttons.push(buttonMap[key.originalEvent?.key]);
			}
		});
		this.notifySubscribers(buttons);
	}

	private notifySubscribers(button: ButtonType[]) {
		this.subscribers.forEach(s => s.func(button));
	}

	pressKey(key: string) {
		const button = buttonMap[key];
		if (button) {
			this.notifySubscribers([button]);
		}
	}
}
