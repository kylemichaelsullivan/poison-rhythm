import clsx from 'clsx';
import type { ContrastLevel } from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type CrayonSwatchProps = {
	name: string;
	hex: string;
	selected: boolean;
	warning: ContrastLevel;
	onSelect: () => void;
};

export function CrayonSwatch({
	name,
	hex,
	selected,
	warning,
	onSelect,
}: CrayonSwatchProps) {
	const warns = warning === 'warn';

	return (
		<button
			type='button'
			className={clsx(
				'CrayonSwatch relative aspect-square w-full rounded-sm border-2 transition-[box-shadow,transform,border-color]',
				focusVisibleRingClassName,
				selected
					? 'border-black shadow-raised scale-105 z-10'
					: 'border-mid shadow-soft hover:border-primary',
				warns && !selected && 'border-dashed opacity-80',
				warns &&
					selected &&
					'ring-2 ring-accent ring-offset-1 ring-offset-chrome',
			)}
			style={{ backgroundColor: hex }}
			title={warns ? `${name} — low contrast warning` : name}
			aria-label={warns ? `${name}, low contrast warning` : name}
			aria-pressed={selected}
			onClick={onSelect}
			data-contrast={warning}
			data-testid={`crayon-swatch-${name.toLowerCase().replace(/\s+/g, '-')}`}
		/>
	);
}
