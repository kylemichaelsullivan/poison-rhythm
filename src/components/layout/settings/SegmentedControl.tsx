import clsx from 'clsx';
import { Fieldset } from './Fieldset';
import type { SegmentOption } from './SegmentButton';
import { SegmentButton } from './SegmentButton';

export type { SegmentOption };

const GRID_COLS_CLASS: Record<number, string> = {
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6',
};

type SegmentedControlProps<T> = {
	options: readonly SegmentOption<T>[];
	value: T;
	/** Accessible name when `legend` is omitted. */
	ariaLabel?: string;
	legend?: string;
	describedBy?: string;
	disabled?: boolean;
	/** Equal-width buttons in a single row (uses CSS grid). */
	equalWidth?: boolean;
	onChange: (value: T) => void;
};

export function SegmentedControl<T>({
	options,
	value,
	ariaLabel,
	legend,
	describedBy,
	disabled = false,
	equalWidth = false,
	onChange,
}: SegmentedControlProps<T>) {
	const gridColsClass = GRID_COLS_CLASS[options.length] ?? 'grid-cols-4';

	return (
		<Fieldset
			name='SegmentedControl'
			legend={legend}
			ariaLabel={ariaLabel}
			describedBy={describedBy}
			disabled={disabled}
		>
			<div
				className={clsx(
					'gap-2',
					equalWidth ? clsx('grid', gridColsClass) : 'flex flex-wrap',
				)}
			>
				{options.map((option) => {
					const isSelected = value === option.value;
					return (
						<SegmentButton
							icon={option.icon}
							icons={option.icons}
							label={option.label}
							selected={isSelected}
							disabled={disabled}
							grow={!equalWidth && options.length <= 4}
							className={equalWidth ? 'w-full min-w-0' : undefined}
							onClick={() => onChange(option.value)}
							key={option.label}
						/>
					);
				})}
			</div>
		</Fieldset>
	);
}
