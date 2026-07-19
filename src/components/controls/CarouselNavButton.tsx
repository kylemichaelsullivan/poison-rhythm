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
			className='CarouselNavButton flex justify-center items-center bg-dark border border-white rounded-lg text-white text-2xl font-bold size-10.5 p-1 transition-colors hover:bg-primary focus-visible:outline-none focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chrome disabled:invisible disabled:cursor-not-allowed'
			title={title}
			disabled={disabled}
			onClick={onClick}
			aria-label={title}
		>
			{label}
		</button>
	);
}
