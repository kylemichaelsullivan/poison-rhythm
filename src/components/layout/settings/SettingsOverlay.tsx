import { useState } from 'react';
import { AppearanceSettingsPanel } from './AppearanceSettingsPanel';
import { GameSettingsPanel } from './GameSettingsPanel';
import { type SettingsTabId, SettingsTabs } from './SettingsTabs';
import { SoundSettingsPanel } from './SoundSettingsPanel';

export function SettingsOverlay() {
	const [activeTab, setActiveTab] = useState<SettingsTabId>('mode');

	return (
		<div className='SettingsOverlay flex min-h-0 w-full flex-1 flex-col'>
			<SettingsTabs activeTab={activeTab} onTabChange={setActiveTab}>
				{activeTab === 'mode' && <GameSettingsPanel />}
				{activeTab === 'sound' && <SoundSettingsPanel />}
				{activeTab === 'appearance' && <AppearanceSettingsPanel />}
			</SettingsTabs>
		</div>
	);
}
