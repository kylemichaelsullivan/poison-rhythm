import clsx from 'clsx';
import type { ReactNode } from 'react';
import { focusVisibleRingClassName } from '@/lib/control-classes';

export type SettingsTabId = 'mode' | 'sound' | 'look';

export type SettingsTabDefinition = {
	id: SettingsTabId;
	label: string;
};

export const SETTINGS_TABS: SettingsTabDefinition[] = [
	{ id: 'mode', label: 'Mode' },
	{ id: 'sound', label: 'Sound' },
	{ id: 'look', label: 'Look' },
];

type SettingsTabsProps = {
	activeTab: SettingsTabId;
	onTabChange: (tab: SettingsTabId) => void;
	children: ReactNode;
};

export function SettingsTabs({
	activeTab,
	onTabChange,
	children,
}: SettingsTabsProps) {
	const activePanelId = `settings-tabpanel-${activeTab}`;

	return (
		<div className='SettingsTabs flex min-h-0 flex-1 flex-col'>
			<div
				className='SettingsTabsList grid shrink-0 grid-cols-3 border-b border-mid'
				role='tablist'
				aria-label='Settings Sections'
			>
				{SETTINGS_TABS.map((tab) => {
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							type='button'
							id={`settings-tab-${tab.id}`}
							className={clsx(
								'SettingsTab px-2 py-2.5 text-sm font-medium transition-colors',
								focusVisibleRingClassName,
								isActive
									? 'border-b-2 border-primary text-primary'
									: 'text-muted hover:text-primary',
							)}
							role='tab'
							aria-selected={isActive}
							aria-controls={activePanelId}
							tabIndex={isActive ? 0 : -1}
							onClick={() => onTabChange(tab.id)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>
			<div
				className='SettingsTabPanel flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto py-4 pe-4'
				id={activePanelId}
				role='tabpanel'
				aria-labelledby={`settings-tab-${activeTab}`}
			>
				{children}
			</div>
		</div>
	);
}
