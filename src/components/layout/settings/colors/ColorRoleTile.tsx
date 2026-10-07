import clsx from 'clsx';
import { pickOnColor } from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type ColorRoleTileProps = {
	label: string;
	hex: string;
	name: string;
	selected: boolean;
	onSelect: () => void;
};

/** Selectable Dominant / Secondary role tile in the color preview. */
export function ColorRoleTile({
	label,
	hex,
	name,
	selected,
	onSelect,
}: ColorRoleTileProps) {
	const onColor = pickOnColor(hex);

	return (
		<button
			type='button'
			className={clsx(
				'ColorRoleTile flex min-h-16 flex-col items-start justify-between gap-2 rounded-lg border-2 px-3 py-2 text-left transition-[box-shadow,border-color]',
				focusVisibleRingClassName,
				selected
					? 'border-black shadow-raised z-10'
					: 'border-mid shadow-soft hover:border-primary',
			)}
			style={{ backgroundColor: hex, color: onColor }}
			aria-pressed={selected}
			aria-label={`${label}: ${name}`}
			title={`${label}: ${name}`}
			onClick={onSelect}
		>
			<span className='text-xs font-semibold uppercase tracking-wide opacity-90'>
				{label}
			</span>
			<span className='text-sm font-medium leading-tight'>{name}</span>
		</button>
	);
}
