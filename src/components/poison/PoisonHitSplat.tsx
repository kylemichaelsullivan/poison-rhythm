import type { CSSProperties } from 'react';

/** Droplet indices for the full-screen splat burst. */
const SPLAT_DROPS = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23,
] as const;

/**
 * Full-viewport Dominant explosion that erupts from the bottle after the hold.
 * Decorative; motion follows system `prefers-reduced-motion` via CSS.
 */
export function PoisonHitSplat() {
	return (
		<div
			className='PoisonHitSplat pointer-events-none absolute inset-0 overflow-hidden'
			aria-hidden='true'
		>
			<div className='PoisonHitSplatBlob' />
			{SPLAT_DROPS.map((index) => (
				<div
					className='PoisonHitSplatDrop'
					style={{ '--splat-i': index } as CSSProperties}
					key={index}
				/>
			))}
		</div>
	);
}
