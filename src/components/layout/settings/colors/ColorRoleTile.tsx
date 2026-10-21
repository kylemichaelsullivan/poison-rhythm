import clsx from 'clsx';
import { pickOnColor } from '@/lib/colors';
import {
	interactiveInsetChromeClassName,
	selectionOutlineActiveClassName,
} from '@/lib/control-classes';

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
				'ColorRoleTile flex min-h-16 min-w-0 flex-col items-center justify-between gap-2 rounded-lg border-2 px-2 py-2 text-center transition-[box-shadow,border-color,outline-color] sm:items-start sm:px-3 sm:text-left',
				interactiveInsetChromeClassName,
				selected
					? ['border-black z-10', selectionOutlineActiveClassName]
					: 'border-mid',
			)}
			style={{ backgroundColor: hex, color: onColor }}
			aria-pressed={selected}
			aria-label={`${label}: ${name}`}
			title={`${label}: ${name}`}
			data-chrome-active={selected || undefined}
			onClick={onSelect}
		>
			<span className='text-xs font-semibold uppercase tracking-wide opacity-90'>
				{label}
			</span>
			<span className='line-clamp-2 break-words text-sm font-medium leading-tight'>
				{name}
			</span>
		</button>
	);
}
