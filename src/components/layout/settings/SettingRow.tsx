import type { ReactNode } from 'react';

type SettingRowProps = {
	label: string;
	children: ReactNode;
};

export function SettingRow({ label, children }: SettingRowProps) {
	return (
		<div className='SettingRow flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:gap-3'>
			<span className='min-w-0 text-sm font-semibold text-dark'>{label}</span>
			<div className='flex min-w-0 shrink-0 justify-start sm:justify-end'>
				{children}
			</div>
		</div>
	);
}
