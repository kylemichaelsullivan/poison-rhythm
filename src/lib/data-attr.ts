/** Explicit `'true' | 'false'` for e2e/CSS contracts that assert both states. */
export function dataBool(value: boolean): 'true' | 'false' {
	return value ? 'true' : 'false';
}

/** Presence-style flag: `'true'` when set, omitted when false. */
export function dataFlag(value: boolean): 'true' | undefined {
	return value ? 'true' : undefined;
}
