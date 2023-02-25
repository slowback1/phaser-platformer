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
	ArrowUp: ButtonType.UP,
	ArrowDown: ButtonType.DOWN,
	ArrowLeft: ButtonType.LEFT,
	ArrowRight: ButtonType.RIGHT,
	z: ButtonType.A,
	x: ButtonType.B,
	a: ButtonType.X,
	s: ButtonType.Y,
	q: ButtonType.SELECT,
	w: ButtonType.START,
	e: ButtonType.L,
	r: ButtonType.R,
};

type subscription = { func: (button: ButtonType) => void; key: number };

export default class ControlManager {
	private static instance: ControlManager;
	static getInstance(): ControlManager {
		if (!ControlManager.instance) {
			ControlManager.instance = new ControlManager();
		}
		return ControlManager.instance;
	}

	private constructor() {}

	private subscribers: subscription[] = [];
	private currentSeed: number = 0;

	subscribe(subscriber: (button: ButtonType) => void): () => void {
		this.subscribers.push({ func: subscriber, key: ++this.currentSeed });
		const key = this.currentSeed;
		return () => {
			this.subscribers = this.subscribers.filter(s => s.key !== key);
		};
	}
	getSubscriptions(): ((button: ButtonType) => void)[] {
		return this.subscribers.map(s => s.func);
	}
	clearSubscriptions() {
		this.subscribers = [];
	}
	onKeyDown(event: KeyboardEvent) {
		const button = buttonMap[event.key];
		if (button) {
			this.notifySubscribers(button);
		}
	}

	private notifySubscribers(button: ButtonType) {
		this.subscribers.forEach(s => s.func(button));
	}
}
