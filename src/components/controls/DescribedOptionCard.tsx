import clsx from 'clsx';
import type { ReactNode } from 'react';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import { OptionCardDescription } from './OptionCardDescription';
import { OptionCardTitle } from './OptionCardTitle';
import { RadioInput } from './RadioInput';

type DescribedOptionCardProps<T extends string> = {
	id: string;
	name: string;
	value: T;
	label: string;
	description: string;
	selected: boolean;
	onSelect: (value: T) => void;
	/** Replaces the default radio dot when set. */
	leading?: ReactNode;
	/** Shown below the description when this option is selected. */
	selectedFooter?: ReactNode;
};

/** Radio card with title + short description (play modes, …). */
export function DescribedOptionCard<T extends string>({
	id,
	name,
	value,
	label,
	description,
	selected,
	onSelect,
	leading,
	selectedFooter,
}: DescribedOptionCardProps<T>) {
	return (
		<div
			className={clsx(
				'DescribedOptionCard overflow-hidden rounded-lg border-2 transition-colors',
				selected
					? 'border-primary bg-primary/10 shadow-raised'
					: 'border-mid/80 bg-surface-muted shadow-soft hover:border-primary/45 hover:bg-chrome hover:shadow-raised',
			)}
		>
			<label
				htmlFor={id}
				className={clsx(
					'flex cursor-pointer items-center gap-4 p-4',
					focusVisibleRingClassName,
					'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-inset',
				)}
			>
				<RadioInput
					id={id}
					name={name}
					checked={selected}
					onChange={() => onSelect(value)}
				/>
				{leading ?? (
					<span
						className={clsx(
							'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
							selected ? 'border-primary' : 'border-mid',
						)}
						aria-hidden
					>
						{selected ? (
							<span className='h-2 w-2 rounded-full bg-primary' />
						) : null}
					</span>
				)}
				<div className='flex min-w-0 flex-1 flex-col gap-1'>
					<OptionCardTitle>{label}</OptionCardTitle>
					<OptionCardDescription>{description}</OptionCardDescription>
				</div>
			</label>
			{selected && selectedFooter ? (
				<div className='border-t border-mid/80 bg-surface-muted/60 px-4 pb-4 pt-3'>
					{selectedFooter}
				</div>
			) : null}
		</div>
	);
}
