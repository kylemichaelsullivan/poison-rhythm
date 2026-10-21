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

const SM_GRID_COLS_CLASS: Record<number, string> = {
	2: 'sm:grid-cols-2',
	3: 'sm:grid-cols-3',
	4: 'sm:grid-cols-4',
	5: 'sm:grid-cols-5',
	6: 'sm:grid-cols-6',
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
	/**
	 * Full-width stacked buttons below `sm`, then a row.
	 * Implies equal-width grid cells.
	 */
	stackBelowSm?: boolean;
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
	stackBelowSm = false,
	onChange,
}: SegmentedControlProps<T>) {
	const gridColsClass = GRID_COLS_CLASS[options.length] ?? 'grid-cols-4';
	const smGridColsClass =
		SM_GRID_COLS_CLASS[options.length] ?? 'sm:grid-cols-4';
	const useGrid = equalWidth || stackBelowSm;

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
					stackBelowSm
						? clsx('grid grid-cols-1', smGridColsClass)
						: equalWidth
							? clsx('grid', gridColsClass)
							: 'flex flex-wrap',
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
							grow={!useGrid && options.length <= 4}
							className={useGrid ? 'w-full min-w-0' : undefined}
							onClick={() => onChange(option.value)}
							key={option.label}
						/>
					);
				})}
			</div>
		</Fieldset>
	);
}
