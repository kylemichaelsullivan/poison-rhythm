import clsx from 'clsx';
import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';
import { Caption } from '@/components/ui';

type PlayModeEndlessOptionProps = {
	endless: boolean;
	onChange: (enabled: boolean) => void;
};

export function PlayModeEndlessOption({
	endless,
	onChange,
}: PlayModeEndlessOptionProps) {
	return (
		<label className='PlayModeEndlessOption flex cursor-pointer gap-3 rounded-md border border-mid bg-white px-3 py-2.5'>
			<span
				className={clsx(
					'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
					endless
						? 'border-primary bg-primary text-white'
						: 'border-mid bg-surface text-dark',
				)}
				aria-hidden
			>
				{endless ? <CheckmarkIcon className='h-3 w-3 fill-current' /> : null}
			</span>
			<input
				type='checkbox'
				className='sr-only'
				checked={endless}
				onChange={(event) => onChange(event.target.checked)}
			/>
			<span className='flex min-w-0 flex-col gap-0.5'>
				<span className='text-sm font-semibold text-black'>Endless</span>
				<Caption>
					Keep playing as measures generate ahead; poison can appear without
					stopping.
				</Caption>
			</span>
		</label>
	);
}
