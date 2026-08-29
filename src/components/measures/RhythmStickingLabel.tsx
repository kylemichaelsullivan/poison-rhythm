type RhythmStickingLabelProps = {
	hand: 'L' | 'R';
};

/** Sticking indicator below a hit; positioned by the parent. */
export function RhythmStickingLabel({ hand }: RhythmStickingLabelProps) {
	return (
		<span
			className='RhythmStickingLabel text-[0.5rem] font-bold leading-none text-dark'
			aria-hidden
		>
			{hand}
		</span>
	);
}
