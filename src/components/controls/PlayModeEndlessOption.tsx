import clsx from 'clsx';
import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';

const ENDLESS_DESCRIPTION =
	'Keep playing as measures generate ahead; poison can appear without stopping';

const ENDLESS_ACTIVATE_DESCRIPTION = 'Poison Rhythm, Endless Play';

/** Visible label when the option card has room; ∞ is the narrow fallback. */
const ENDLESS_PROMPT = 'Endless?';

type PlayModeEndlessOptionProps = {
	endless: boolean;
	onChange: (enabled: boolean) => void;
	/**
	 * Faded while Bucket is active — still clickable; activates Poison Rhythm
	 * + Endless via `onChange(true)`.
	 */
	faded?: boolean;
};

/**
 * Endless checkbox for the Poison Rhythm row. Shows “Endless?” when the parent
 * `@container/option-card` is wide enough; otherwise ∞.
 */
export function PlayModeEndlessOption({
	endless,
	onChange,
	faded = false,
}: PlayModeEndlessOptionProps) {
	return (
		<label
			className={clsx(
				'PlayModeEndlessOption flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-1 transition-[opacity,box-shadow] hover:shadow-soft has-[:focus-visible]:shadow-soft',
				faded && 'opacity-40',
			)}
			title={faded ? ENDLESS_ACTIVATE_DESCRIPTION : ENDLESS_DESCRIPTION}
			aria-label={faded ? 'Select Poison Rhythm with Endless' : ENDLESS_PROMPT}
		>
			<span
				className={clsx(
					'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
					endless && !faded
						? 'border-primary-border bg-primary text-on-primary'
						: 'border-mid bg-surface text-dark',
				)}
				aria-hidden
			>
				{endless && !faded ? (
					<CheckmarkIcon className='h-3 w-3 fill-current' />
				) : null}
			</span>
			<input
				type='checkbox'
				className='sr-only'
				checked={endless && !faded}
				onChange={(event) => {
					if (faded) {
						onChange(true);
						return;
					}
					onChange(event.target.checked);
				}}
			/>
			<span
				className='hidden text-sm font-semibold text-dark @[16rem]/option-card:inline'
				aria-hidden
			>
				{ENDLESS_PROMPT}
			</span>
			<span
				className='text-base font-bold leading-none text-dark @[16rem]/option-card:hidden'
				aria-hidden
			>
				∞
			</span>
		</label>
	);
}
