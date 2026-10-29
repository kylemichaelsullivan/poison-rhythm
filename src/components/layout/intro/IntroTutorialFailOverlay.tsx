import { useEffect, useState } from 'react';
import {
	INTRO_FAIL_REVEAL_MS,
	INTRO_POISON_FAIL_LOSE,
	INTRO_POISON_FAIL_POISON,
} from '@/lib/intro-tutorial';

type FailPhase = 'idle' | 'poison' | 'lose';

const lineClassName =
	'rounded bg-white px-2 py-0.5 text-center text-sm font-semibold leading-5 text-primary';

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Timed fail stamps over the last-slide measure. */
export function IntroTutorialFailOverlay() {
	const [phase, setPhase] = useState<FailPhase>('idle');

	useEffect(() => {
		if (prefersReducedMotion()) {
			setPhase('lose');
			return;
		}

		const poisonTimer = window.setTimeout(() => {
			setPhase('poison');
		}, INTRO_FAIL_REVEAL_MS);
		const loseTimer = window.setTimeout(() => {
			setPhase('lose');
		}, INTRO_FAIL_REVEAL_MS * 2);

		return () => {
			window.clearTimeout(poisonTimer);
			window.clearTimeout(loseTimer);
		};
	}, []);

	return (
		<output className='IntroTutorialFailOverlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1'>
			{phase === 'idle' ? null : (
				<span className={lineClassName}>{INTRO_POISON_FAIL_POISON}</span>
			)}
			{phase === 'lose' ? (
				<span className={lineClassName}>{INTRO_POISON_FAIL_LOSE}</span>
			) : null}
		</output>
	);
}
