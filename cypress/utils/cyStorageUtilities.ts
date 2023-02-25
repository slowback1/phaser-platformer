export enum StorageType {
	LOCAL_STORAGE = "localStorage",
	COOKIE = "cookie",
	SESSION_STORAGE = "sessionStorage",
}
export default class CyStorageUtilities {
	static clearStorage(storageType?: StorageType) {
		const clearAllStorage = storageType === undefined;

		if (clearAllStorage || storageType === StorageType.LOCAL_STORAGE) cy.clearLocalStorage();
		if (clearAllStorage || storageType === StorageType.SESSION_STORAGE) cy.clearAllSessionStorage();
		if (clearAllStorage || storageType === StorageType.COOKIE) cy.clearCookies();
	}
	static setStorageFromFixture(fileName: string, key: string, storageType: StorageType) {
		cy.fixture(fileName).then(fixture => {
			switch (storageType) {
				case StorageType.LOCAL_STORAGE:
					localStorage.setItem(key, JSON.stringify(fixture));
					break;
				case StorageType.COOKIE:
					cy.setCookie(key, JSON.stringify(fixture));
					break;
				case StorageType.SESSION_STORAGE:
					sessionStorage.setItem(key, JSON.stringify(fixture));
					break;
			}
		});
	}
}
