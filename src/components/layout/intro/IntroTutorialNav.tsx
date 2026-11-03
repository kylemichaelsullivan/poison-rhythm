import clsx from 'clsx';
import { useCallback } from 'react';
import { Button } from '@/components/ui';
import { IntroTutorialDots } from './IntroTutorialDots';

type IntroTutorialNavProps = {
	stepIndex: number;
	stepCount: number;
	/** Let’s Play Secondary halo after fail copy lands (owned by IntroModal). */
	playHalo: boolean;
	onBack: () => void;
	onNext: () => void;
	onPlay: () => void;
	onSelectStep: (index: number) => void;
};

/** Back / dots / Next or Let’s Play for the welcome tutorial. */
export function IntroTutorialNav({
	stepIndex,
	stepCount,
	playHalo,
	onBack,
	onNext,
	onPlay,
	onSelectStep,
}: IntroTutorialNavProps) {
	const last = stepIndex >= stepCount - 1;

	// Focus the primary CTA when it mounts (Next ↔ Let’s Play), so Enter/Space
	// activate it instead of leaking to the page after the previous button unmounts.
	const focusPrimaryOnMount = useCallback((node: HTMLButtonElement | null) => {
		node?.focus();
	}, []);

	return (
		<div className='grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center'>
			{/* Side padding keeps IntroPlayHalo’s outer ring inside the modal body’s overflow clip. */}
			<div className='justify-self-start p-2.5'>
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
			<div className='justify-self-end p-2.5'>
				{last ? (
					<span className={clsx(playHalo && 'IntroPlayHalo')}>
						<Button
							ref={focusPrimaryOnMount}
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
						ref={focusPrimaryOnMount}
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
