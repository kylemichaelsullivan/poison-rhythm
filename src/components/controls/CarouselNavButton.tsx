import { carouselNavButtonClassName } from '@/lib/control-classes';

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
	const title = direction === 'prev' ? 'Previous Measure' : 'Next Measure';

	return (
		<button
			type='button'
			className={carouselNavButtonClassName(disabled)}
			title={title}
			disabled={disabled}
			onClick={onClick}
			aria-label={title}
		>
			{disabled ? null : label}
		</button>
	);
}
