import type { ReactNode } from 'react';
import { SettingsGroup } from './SettingsGroup';

type ConditionalSettingsGroupProps = {
	when: boolean;
	title: string;
	children: ReactNode;
};

export function ConditionalSettingsGroup({
	when,
	title,
	children,
}: ConditionalSettingsGroupProps) {
	if (!when) {
		return null;
	}

	return <SettingsGroup title={title}>{children}</SettingsGroup>;
}
