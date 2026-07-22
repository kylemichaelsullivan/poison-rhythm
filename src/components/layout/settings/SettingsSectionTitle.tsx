import type { ReactNode } from 'react';

type SettingsSectionTitleProps = {
	children: ReactNode;
};

export function SettingsSectionTitle({ children }: SettingsSectionTitleProps) {
	return (
		<h3 className='SettingsSectionTitle border-b border-mid text-dark text-sm font-semibold pb-2'>
			{children}
		</h3>
	);
}
