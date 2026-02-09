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
			className='CarouselNavButton bg-dark border border-white rounded-lg text-white font-bold px-3 py-2 transition hover:bg-mid disabled:invisible disabled:cursor-not-allowed'
			title={title}
			disabled={disabled}
			onClick={onClick}
		>
			{label}
		</button>
	);
}
