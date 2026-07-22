import { Fieldset } from './Fieldset';
import type { SegmentOption } from './SegmentButton';
import { SegmentButton } from './SegmentButton';

export type { SegmentOption };

type SegmentedControlProps<T> = {
	options: readonly SegmentOption<T>[];
	value: T;
	/** Accessible name when `legend` is omitted. */
	ariaLabel?: string;
	legend?: string;
	describedBy?: string;
	disabled?: boolean;
	onChange: (value: T) => void;
};

export function SegmentedControl<T>({
	options,
	value,
	ariaLabel,
	legend,
	describedBy,
	disabled = false,
	onChange,
}: SegmentedControlProps<T>) {
	return (
		<Fieldset
			name='SegmentedControl'
			legend={legend}
			ariaLabel={ariaLabel}
			describedBy={describedBy}
			disabled={disabled}
		>
			<div className='flex gap-2'>
				{options.map((option) => {
					const isSelected = value === option.value;
					return (
						<SegmentButton
							icon={option.icon}
							label={option.label}
							selected={isSelected}
							disabled={disabled}
							onClick={() => onChange(option.value)}
							key={option.label}
						/>
					);
				})}
			</div>
		</Fieldset>
	);
}
