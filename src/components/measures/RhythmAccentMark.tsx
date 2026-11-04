/** Accent indicator above a hit; positioned by the parent. */
export function RhythmAccentMark() {
	return (
		<span
			className='RhythmAccentMark pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 text-3xs font-bold leading-none text-accent'
			aria-hidden
		>
			›
		</span>
	);
}
