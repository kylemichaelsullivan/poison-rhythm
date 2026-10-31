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
			onClick={onSelect}
			aria-current={current ? 'step' : undefined}
			aria-label={`Step ${step} of ${stepCount}`}
		>
			<span
				className={clsx(
					'size-2 rounded-full transition-[box-shadow] duration-200 ease-out',
					current ? 'bg-primary' : 'bg-mid',
				)}
				aria-hidden
			/>
		</button>
	);
}
