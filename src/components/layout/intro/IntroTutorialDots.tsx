import { IntroTutorialDot } from './IntroTutorialDot';

type IntroTutorialDotsProps = {
	stepIndex: number;
	stepCount: number;
	onSelect: (index: number) => void;
};

/** Clickable current-step dots for the welcome tutorial. */
export function IntroTutorialDots({
	stepIndex,
	stepCount,
	onSelect,
}: IntroTutorialDotsProps) {
	const steps = Array.from({ length: stepCount }, (_, index) => index + 1);

	return (
		<nav
			className='IntroTutorialDots flex items-center'
			aria-label='Tutorial Steps'
		>
			{steps.map((step) => (
				<IntroTutorialDot
					current={step === stepIndex + 1}
					key={step}
					step={step}
					stepCount={stepCount}
					onSelect={() => onSelect(step - 1)}
				/>
			))}
		</nav>
	);
}
