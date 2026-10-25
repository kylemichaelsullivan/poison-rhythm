import { SettingsGroup } from './SettingsGroup';
import type { ReactNode } from 'react';

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
