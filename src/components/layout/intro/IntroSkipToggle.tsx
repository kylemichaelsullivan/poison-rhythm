import clsx from 'clsx';
import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';

type IntroSkipToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

/** Opt in to hiding the welcome on this device. */
export function IntroSkipToggle({ checked, onChange }: IntroSkipToggleProps) {
	return (
		<label className='IntroSkipToggle relative flex min-h-11 w-full cursor-pointer items-center justify-center gap-3'>
			<input
				type='checkbox'
				className='absolute inset-0 cursor-pointer opacity-0'
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
			/>
			<span
				className={clsx(
					'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
					checked
						? 'border-primary-border bg-primary text-on-primary'
						: 'border-mid bg-surface text-dark',
				)}
				aria-hidden
			>
				{checked ? <CheckmarkIcon className='h-3 w-3 fill-current' /> : null}
			</span>
			<span className='text-sm text-dark'>Don’t show again</span>
		</label>
	);
}
