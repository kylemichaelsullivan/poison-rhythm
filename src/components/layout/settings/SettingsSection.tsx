import type { ReactNode } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { SettingsSectionTitle } from './SettingsSectionTitle';

type SettingsSectionProps = {
	title: string;
	children: ReactNode;
};

/** Titled settings group on a bordered panel surface. */
export function SettingsSection({ title, children }: SettingsSectionProps) {
	return (
		<SettingsPanel className='SettingsSection'>
			<SettingsSectionTitle>{title}</SettingsSectionTitle>
			{children}
		</SettingsPanel>
	);
}
