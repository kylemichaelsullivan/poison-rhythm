import clsx from 'clsx';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import { OptionCardTitle } from './OptionCardTitle';
import { RadioInput } from './RadioInput';
import type { ReactNode } from 'react';

type DescribedOptionCardProps<T extends string> = {
	id: string;
	name: string;
	value: T;
	label: string;
	/** Hover explanation (`title`); not shown as body copy. */
	description: string;
	selected: boolean;
	onSelect: (value: T) => void;
	/** Replaces the default radio dot when set. */
	leading?: ReactNode;
	/** Trailing control on the same row (e.g. Endless checkbox). */
	trailing?: ReactNode;
};

/** Radio card with bold label; description on hover via `title`. */
export function DescribedOptionCard<T extends string>({
	id,
	name,
	value,
	label,
	description,
	selected,
	onSelect,
	leading,
	trailing,
}: DescribedOptionCardProps<T>) {
	return (
		<div
			className={clsx(
				'DescribedOptionCard @container/option-card flex items-center overflow-hidden rounded-lg border-2 transition-colors',
				selected
					? 'border-primary bg-primary/10'
					: 'border-mid/80 bg-surface-muted hover:border-primary hover:shadow-raised',
			)}
		>
			<label
				htmlFor={id}
				title={description}
				className={clsx(
					'flex min-w-0 flex-1 cursor-pointer items-center gap-4 p-4',
					focusVisibleRingClassName,
					'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-inset has-[:focus-visible]:shadow-raised',
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
				<OptionCardTitle>{label}</OptionCardTitle>
			</label>
			{trailing ? <div className='shrink-0 pr-3'>{trailing}</div> : null}
		</div>
	);
}
