type ControlButtonProps = {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary';
	disabled?: boolean;
};

export function ControlButton({
	label,
	onClick,
	variant = 'secondary',
	disabled = false,
}: ControlButtonProps) {
	const base = 'border rounded font-medium px-4 py-2 transition';
	const styles = disabled
		? 'border-dark bg-dark text-mid cursor-not-allowed'
		: variant === 'primary'
			? 'border-mid bg-primary text-white hover:opacity-90'
			: 'border-mid bg-dark text-white hover:bg-mid';

	return (
		<button
			type='button'
			className={`ControlButton ${base} ${styles}`}
			onClick={onClick}
			disabled={disabled}
		>
			{label}
		</button>
	);
}
