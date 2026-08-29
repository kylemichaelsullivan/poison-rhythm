const storageListeners = new Map<string, Set<() => void>>();

export function isStorageAvailable(): boolean {
	return typeof globalThis.localStorage !== 'undefined';
}

export function readStorageItem(key: string): string | null {
	if (!isStorageAvailable()) {
		return null;
	}

	try {
		return globalThis.localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function writeStorageItem(key: string, value: string): void {
	if (!isStorageAvailable()) {
		return;
	}

	try {
		globalThis.localStorage.setItem(key, value);
		notifyStorageListeners(key);
	} catch {
		// Quota exceeded, private mode, or disabled storage.
	}
}

export function removeStorageItem(key: string): void {
	if (!isStorageAvailable()) {
		return;
	}

	try {
		globalThis.localStorage.removeItem(key);
		notifyStorageListeners(key);
	} catch {
		// Ignore storage failures.
	}
}

export function subscribeStorageKey(
	key: string,
	callback: () => void,
): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	let keyListeners = storageListeners.get(key);
	if (!keyListeners) {
		keyListeners = new Set();
		storageListeners.set(key, keyListeners);
	}
	keyListeners.add(callback);

	const onStorageEvent = (event: StorageEvent) => {
		if (event.key === key) {
			callback();
		}
	};
	window.addEventListener('storage', onStorageEvent);

	return () => {
		keyListeners?.delete(callback);
		window.removeEventListener('storage', onStorageEvent);
	};
}

function notifyStorageListeners(key: string): void {
	storageListeners.get(key)?.forEach((callback) => {
		callback();
	});
}
