import ControlManager, { ButtonType } from "./controllerManager";

describe("controlManager", () => {
	let controllerManager: ControlManager;
	let subscriberMock: jest.Mock;
	beforeEach(() => {
		controllerManager = ControlManager.getInstance();
		subscriberMock = jest.fn();
	});
	afterEach(() => {
		controllerManager.clearSubscriptions();
	});

	it("should be a singleton", () => {
		expect(controllerManager).toBe(ControlManager.getInstance());
	});
	it("can subscribe without breaking", () => {
		controllerManager.subscribe(subscriberMock);
		const subscriptions = controllerManager.getSubscriptions();
		expect(subscriptions.length).toBe(1);
	});
	it("can unsubscribe without breaking", () => {
		const unsubscribe = controllerManager.subscribe(subscriberMock);
		unsubscribe();
		const subscriptions = controllerManager.getSubscriptions();
		expect(subscriptions.length).toBe(0);
	});

	it("clearSubscriptions clears all subscriptions", () => {
		controllerManager.subscribe(subscriberMock);
		controllerManager.subscribe(subscriberMock);
		controllerManager.subscribe(subscriberMock);
		controllerManager.clearSubscriptions();
		const subscriptions = controllerManager.getSubscriptions();
		expect(subscriptions.length).toBe(0);
	});

	describe("onKeyDown", () => {
		it("calls the subscriber when a key that is in the button map is pressed", () => {
			controllerManager.subscribe(subscriberMock);
			const event: KeyboardEvent = { key: "ArrowUp" } as KeyboardEvent;
			controllerManager.onKeyDown(event);
			expect(subscriberMock).toBeCalled();
		});
		it("does not call the subscriber when a key that is not in the button map is pressed", () => {
			controllerManager.subscribe(subscriberMock);
			const event: KeyboardEvent = { key: "i" } as KeyboardEvent;
			controllerManager.onKeyDown(event);
			expect(subscriberMock).not.toBeCalled();
		});
		it("does not call the subscriber if they have unsubscribed", () => {
			const unsubscribe = controllerManager.subscribe(subscriberMock);
			unsubscribe();
			const event: KeyboardEvent = { key: "ArrowUp" } as KeyboardEvent;
			controllerManager.onKeyDown(event);
			expect(subscriberMock).not.toBeCalled();
		});
		it("calls the subscriber with the correct button", () => {
			controllerManager.subscribe(subscriberMock);
			const event: KeyboardEvent = { key: "ArrowUp" } as KeyboardEvent;
			controllerManager.onKeyDown(event);
			expect(subscriberMock).toBeCalledWith([ButtonType.UP]);
		});
	});
});
