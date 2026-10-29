import clsx from 'clsx';

type IntroTutorialDotProps = {
	step: number;
	stepCount: number;
	current: boolean;
	onSelect: () => void;
};

/** Quiet step control: a small current/idle dot in a 44px hit target. */
export function IntroTutorialDot({
	step,
	stepCount,
	current,
	onSelect,
}: IntroTutorialDotProps) {
	return (
		<button
			type='button'
			className='IntroTutorialDot flex h-11 w-8 shrink-0 items-center justify-center rounded-full'
			aria-label={`Step ${step} of ${stepCount}`}
			aria-current={current ? 'step' : undefined}
			onClick={onSelect}
		>
			<span
				className={clsx(
					'size-2 rounded-full',
					current ? 'bg-primary' : 'bg-mid',
				)}
				aria-hidden
			/>
		</button>
	);
}
