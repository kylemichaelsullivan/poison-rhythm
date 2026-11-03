import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { INTRO_PLAY_HALO_AFTER_MS } from '@/lib/intro-tutorial';
import { IntroTutorialDots } from './IntroTutorialDots';

type IntroTutorialNavProps = {
	stepIndex: number;
	stepCount: number;
	onBack: () => void;
	onNext: () => void;
	onPlay: () => void;
	onSelectStep: (index: number) => void;
};

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Back / dots / Next or Let’s Play for the welcome tutorial. */
export function IntroTutorialNav({
	stepIndex,
	stepCount,
	onBack,
	onNext,
	onPlay,
	onSelectStep,
}: IntroTutorialNavProps) {
	const last = stepIndex >= stepCount - 1;
	const [playHalo, setPlayHalo] = useState(false);

	useEffect(() => {
		if (!last) {
			setPlayHalo(false);
			return;
		}

		if (prefersReducedMotion()) {
			setPlayHalo(true);
			return;
		}

		setPlayHalo(false);
		const timer = window.setTimeout(() => {
			setPlayHalo(true);
		}, INTRO_PLAY_HALO_AFTER_MS);

		return () => {
			window.clearTimeout(timer);
		};
	}, [last]);

	return (
		<div className='grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center'>
			<div className='justify-self-start'>
				<Button
					variant='secondary'
					title='Go to Previous Welcome Step'
					disabled={stepIndex === 0}
					onClick={onBack}
				>
					Back
				</Button>
			</div>
			<IntroTutorialDots
				stepIndex={stepIndex}
				stepCount={stepCount}
				onSelect={onSelectStep}
			/>
			<div className='justify-self-end'>
				{last ? (
					<span className={clsx(playHalo && 'IntroPlayHalo')}>
						<Button
							variant='primary'
							title='Close Welcome and Start Playing'
							modalInitialFocus
							onClick={onPlay}
						>
							Let’s Play
						</Button>
					</span>
				) : (
					<Button
						variant='primary'
						title='Go to Next Welcome Step'
						modalInitialFocus
						onClick={onNext}
					>
						Next
					</Button>
				)}
			</div>
		</div>
	);
}
