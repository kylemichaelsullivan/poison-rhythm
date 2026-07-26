type CarouselNavButtonProps = {
	direction: 'prev' | 'next';
	onClick: () => void;
	disabled?: boolean;
};

export function CarouselNavButton({
	direction,
	onClick,
	disabled = false,
}: CarouselNavButtonProps) {
	const label = direction === 'prev' ? '←' : '→';
	const title = direction === 'prev' ? 'Previous' : 'Next';

	return (
		<button
			type='button'
			className='CarouselNavButton flex justify-center items-center bg-surface-muted border border-mid rounded-lg text-black text-2xl font-bold size-10.5 p-1 transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:bg-primary focus-visible:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:invisible disabled:cursor-not-allowed'
			title={title}
			disabled={disabled}
			onClick={onClick}
			aria-label={title}
		>
			{label}
		</button>
	);
}
