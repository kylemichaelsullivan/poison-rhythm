import poisonBottleUrl from '@/assets/img/poison-bottle.png';

/**
 * Poison bottle under the hit title: holds, then explodes (CSS).
 * Decorative; parent owns a11y copy. Full-screen splat lives in `PoisonHitSplat`.
 */
export function PoisonHitBottle() {
	return (
		<img
			className='PoisonHitBottle relative z-10 mx-auto mt-4 h-[5.5rem] w-auto sm:h-28'
			src={poisonBottleUrl}
			alt=''
			width={61}
			height={82}
			draggable={false}
		/>
	);
}
