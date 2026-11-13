import clsx from 'clsx';
import ArrowDownIcon from '@/assets/svg/arrow-down.svg?react';
import ArrowLeftIcon from '@/assets/svg/arrow-left.svg?react';
import ArrowRightIcon from '@/assets/svg/arrow-right.svg?react';
import ArrowUpIcon from '@/assets/svg/arrow-up.svg?react';
import { SCROLL_DIRECTION_LABELS } from '@/lib/settings-labels';
import { Fieldset } from './Fieldset';
import { SegmentButton } from './SegmentButton';
import type { SvgIconComponent } from '@/components/layout/Icon';
import type { ScrollDir } from '@/lib/settings-labels';

type PadCell = {
	direction: ScrollDir;
	label: string;
	icon: SvgIconComponent;
	/** Tailwind grid placement on a 3×3 pad. */
	placement: string;
};

const PAD_CELLS: readonly PadCell[] = [
	{
		direction: 'up',
		label: SCROLL_DIRECTION_LABELS.up,
		icon: ArrowUpIcon,
		placement: 'col-start-2 row-start-1',
	},
	{
		direction: 'left',
		label: SCROLL_DIRECTION_LABELS.left,
		icon: ArrowLeftIcon,
		placement: 'col-start-1 row-start-2',
	},
	{
		direction: 'right',
		label: SCROLL_DIRECTION_LABELS.right,
		icon: ArrowRightIcon,
		placement: 'col-start-3 row-start-2',
	},
	{
		direction: 'down',
		label: SCROLL_DIRECTION_LABELS.down,
		icon: ArrowDownIcon,
		placement: 'col-start-2 row-start-3',
	},
];

type ScrollDirectionPadProps = {
	value: ScrollDir;
	onChange: (direction: ScrollDir) => void;
	disabled?: boolean;
};

/**
 * Single-press D-pad for Scroll highway travel direction.
 * One tap sets up / down / left / right (no separate orientation step).
 */
export function ScrollDirectionPad({
	value,
	onChange,
	disabled = false,
}: ScrollDirectionPadProps) {
	return (
		<Fieldset name='ScrollDirectionPad' legend='Direction' disabled={disabled}>
			<div className='ScrollDirectionPadGrid mx-auto grid w-fit grid-cols-3 grid-rows-3 gap-2'>
				{PAD_CELLS.map((cell) => (
					<SegmentButton
						key={cell.direction}
						icon={cell.icon}
						label={cell.label}
						selected={value === cell.direction}
						disabled={disabled}
						grow={false}
						className={clsx(
							'aspect-square size-11 min-h-11 p-1.5',
							cell.placement,
						)}
						onClick={() => onChange(cell.direction)}
					/>
				))}
			</div>
		</Fieldset>
	);
}
