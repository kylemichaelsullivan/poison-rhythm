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

export type LocalStorageSetter<T> = (value: T | ((previous: T) => T)) => void;

function persistValue<T>(
	key: string,
	next: T,
	serialize: (value: T) => string | null,
	cacheRef: { current: { raw: string | null; value: T } | null },
) {
	const encoded = serialize(next);
	if (encoded === null) {
		removeStorageItem(key);
		cacheRef.current = { raw: null, value: next };
	} else {
		writeStorageItem(key, encoded);
		cacheRef.current = { raw: encoded, value: next };
	}
}

export function useLocalStorage<T>({
	key,
	parse,
	serialize,
	getDefault,
}: UseLocalStorageOptions<T>): [T, LocalStorageSetter<T>] {
	const cacheRef = useRef<{ raw: string | null; value: T } | null>(null);
	const parseRef = useRef(parse);
	const getDefaultRef = useRef(getDefault);
	const serializeRef = useRef(serialize);
	parseRef.current = parse;
	getDefaultRef.current = getDefault;
	serializeRef.current = serialize;

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

	const setValue = useCallback<LocalStorageSetter<T>>(
		(next) => {
			const previous = getSnapshot();
			const resolved =
				typeof next === 'function'
					? (next as (previous: T) => T)(previous)
					: next;
			persistValue(key, resolved, serializeRef.current, cacheRef);
		},
		[key, getSnapshot],
	);

	return [value, setValue];
}
