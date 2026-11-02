import { Button } from '@/components/ui';
import { IntroTutorialDots } from './IntroTutorialDots';

type IntroTutorialNavProps = {
	stepIndex: number;
	stepCount: number;
	onBack: () => void;
	onNext: () => void;
	onPlay: () => void;
	onSelectStep: (index: number) => void;
};

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
					<Button
						variant='primary'
						title='Close Welcome and Start Playing'
						modalInitialFocus
						onClick={onPlay}
					>
						Let’s Play
					</Button>
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
