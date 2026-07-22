import type { ReactNode } from 'react';

type SettingRowProps = {
	label: string;
	children: ReactNode;
};

export function SettingRow({ label, children }: SettingRowProps) {
	return (
		<div className='SettingRow flex items-center justify-between gap-3'>
			<span className='text-sm font-semibold text-dark'>{label}</span>
			{children}
		</div>
	);
}
