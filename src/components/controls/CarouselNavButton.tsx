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
			className='CarouselNavButton flex size-11 items-center justify-center rounded-lg border-2 border-secondary bg-surface p-1 text-2xl font-bold text-black transition-[colors,box-shadow] hover:bg-primary hover:text-on-primary hover:shadow-raised focus-visible:outline-none focus-visible:bg-primary focus-visible:text-on-primary focus-visible:shadow-raised focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:invisible disabled:cursor-not-allowed'
			title={title}
			disabled={disabled}
			onClick={onClick}
			aria-label={title}
		>
			{label}
		</button>
	);
}
