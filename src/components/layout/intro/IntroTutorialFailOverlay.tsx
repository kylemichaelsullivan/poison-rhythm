import { useEffect, useState } from 'react';
import {
	INTRO_FAIL_REVEAL_MS,
	INTRO_POISON_FAIL_LOSE,
	INTRO_POISON_FAIL_POISON,
} from '@/lib/intro-tutorial';

type FailPhase = 'idle' | 'poison' | 'lose';

const LOSE_EMPHASIS = 'lose';
const [loseBefore, loseAfter] = INTRO_POISON_FAIL_LOSE.split(LOSE_EMPHASIS);

const chipClassName =
	'rounded bg-white px-2 py-1 text-center text-sm font-semibold leading-5 text-primary';

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Timed fail stamps centered over the Measure section. */
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
		<output className='IntroTutorialFailOverlay pointer-events-none absolute inset-0 flex flex-col items-center justify-around py-4'>
			{phase === 'idle' ? null : (
				<span className={chipClassName}>{INTRO_POISON_FAIL_POISON}</span>
			)}
			{phase === 'lose' ? (
				<span className={chipClassName}>
					{loseBefore}
					<span className='IntroLoseUnderline'>{LOSE_EMPHASIS}</span>
					{loseAfter}
				</span>
			) : null}
		</output>
	);
}
