import clsx from 'clsx';
import type { ReactNode } from 'react';

type FieldsetProps = {
	name: string;
	children: ReactNode;
	legend?: string;
	/** Accessible name when `legend` is omitted. */
	ariaLabel?: string;
	describedBy?: string;
	disabled?: boolean;
};

export function Fieldset({
	name,
	children,
	legend,
	ariaLabel,
	describedBy,
	disabled = false,
}: FieldsetProps) {
	return (
		<fieldset
			className={clsx(name, 'flex flex-col gap-2')}
			disabled={disabled}
			aria-describedby={describedBy}
			aria-label={legend ? undefined : ariaLabel}
		>
			{legend ? (
				<legend className='pb-2 text-sm font-semibold text-dark'>
					{legend}
				</legend>
			) : null}
			{children}
		</fieldset>
	);
}
