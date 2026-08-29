import { useCallback, useRef, useSyncExternalStore } from 'react';
import {
	readStorageItem,
	removeStorageItem,
	subscribeStorageKey,
	writeStorageItem,
} from '@/lib/storage';

type UseLocalStorageOptions<T> = {
	key: string;
	parse: (raw: string | null) => T;
	serialize: (value: T) => string | null;
	getDefault: () => T;
};

export function useLocalStorage<T>({
	key,
	parse,
	serialize,
	getDefault,
}: UseLocalStorageOptions<T>): [T, (value: T) => void] {
	const cacheRef = useRef<{ raw: string | null; value: T } | null>(null);
	const parseRef = useRef(parse);
	const getDefaultRef = useRef(getDefault);
	parseRef.current = parse;
	getDefaultRef.current = getDefault;

	const getSnapshot = useCallback((): T => {
		const raw = readStorageItem(key);
		if (cacheRef.current?.raw === raw) {
			return cacheRef.current.value;
		}

		const value =
			raw === null ? getDefaultRef.current() : parseRef.current(raw);
		cacheRef.current = { raw, value };
		return value;
	}, [key]);

	const value = useSyncExternalStore(
		useCallback(
			(onStoreChange) => subscribeStorageKey(key, onStoreChange),
			[key],
		),
		getSnapshot,
		getSnapshot,
	);

	const setValue = useCallback(
		(next: T) => {
			const encoded = serialize(next);
			if (encoded === null) {
				removeStorageItem(key);
				cacheRef.current = { raw: null, value: next };
			} else {
				writeStorageItem(key, encoded);
				cacheRef.current = { raw: encoded, value: next };
			}
		},
		[key, serialize],
	);

	return [value, setValue];
}
