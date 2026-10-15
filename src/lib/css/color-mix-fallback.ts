/**
 * Build a declaration value that does not use color-mix() or wide-gamut
 * functions, so iOS WebKit (Safari and Chrome) can keep a visible color
 * when those functions are missing or fail at computed-value time.
 */

const UNSAFE_COLOR =
	/^(?:oklch|oklab|lab|lch|color|light-dark|color-mix)\s*\(/i;

function splitTopLevel(value: string): string[] {
	const parts: string[] = [];
	let start = 0;
	let depth = 0;
	for (let index = 0; index < value.length; index++) {
		const char = value[index];
		if (char === '(') depth += 1;
		else if (char === ')') depth -= 1;
		else if (char === ',' && depth === 0) {
			parts.push(value.slice(start, index).trim());
			start = index + 1;
		}
	}
	parts.push(value.slice(start).trim());
	return parts;
}

function matchingParen(value: string, openIndex: number): number | null {
	let depth = 0;
	for (let index = openIndex; index < value.length; index++) {
		const char = value[index];
		if (char === '(') depth += 1;
		else if (char === ')') {
			depth -= 1;
			if (depth === 0) return index;
		}
	}
	return null;
}

/** First color in a color-mix() argument list, without its mix percentage. */
export function firstSafeMixColor(inner: string): string | null {
	const parts = splitTopLevel(inner);
	if (parts.length < 2) return null;
	const method = parts[0] ?? '';
	const methodOk =
		/^in\s+[a-z0-9-]+(?:\s+(?:shorter|longer|increasing|decreasing)\s+hue)?$/i.test(
			method,
		);
	if (!methodOk) return null;
	const component = parts[1] ?? '';
	const color = component.replace(/\s+\d+(?:\.\d+)?%\s*$/, '').trim();
	if (!color || UNSAFE_COLOR.test(color)) return null;
	return color;
}

/** Replace every color-mix() with a hex, rgb, or var() color. Null if any mix is unsafe. */
export function colorMixFallbackValue(value: string): string | null {
	if (!value.includes('color-mix(')) return null;
	let output = '';
	let cursor = 0;
	while (cursor < value.length) {
		const start = value.indexOf('color-mix(', cursor);
		if (start === -1) {
			output += value.slice(cursor);
			break;
		}
		const open = start + 'color-mix'.length;
		const end = matchingParen(value, open);
		if (end == null) return null;
		const color = firstSafeMixColor(value.slice(open + 1, end));
		if (color == null) return null;
		output += value.slice(cursor, start) + color;
		cursor = end + 1;
	}
	if (output.includes('color-mix(') || output === value) return null;
	return output;
}

/** Prefix gradient functions for older WebKit. Returns null when nothing changes. */
export function webkitGradientValue(value: string): string | null {
	if (!/(?:radial|linear)-gradient\(/.test(value)) return null;
	if (value.includes('-webkit-')) return null;
	const prefixed = value
		.replaceAll('radial-gradient(', '-webkit-radial-gradient(')
		.replaceAll('linear-gradient(', '-webkit-linear-gradient(');
	return prefixed === value ? null : prefixed;
}
