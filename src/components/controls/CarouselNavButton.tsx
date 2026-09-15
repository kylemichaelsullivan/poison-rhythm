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
			className='CarouselNavButton flex justify-center items-center bg-surface-muted border border-mid rounded-lg text-dark text-2xl font-bold size-10.5 p-1 shadow-control transition-[colors,box-shadow] hover:border-primary-border hover:bg-primary hover:text-on-primary hover:shadow-primary-glow focus-visible:outline-none focus-visible:border-primary-border focus-visible:bg-primary focus-visible:text-on-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:invisible disabled:cursor-not-allowed'
			title={title}
			disabled={disabled}
			onClick={onClick}
			aria-label={title}
		>
			{label}
		</button>
	);
}
