import { useState } from 'react';
import { GameSettingsPanel } from './GameSettingsPanel';
import { LookSettingsPanel } from './LookSettingsPanel';
import { type SettingsTabId, SettingsTabs } from './SettingsTabs';
import { SoundSettingsPanel } from './SoundSettingsPanel';

export function SettingsOverlay() {
	const [activeTab, setActiveTab] = useState<SettingsTabId>('mode');

	return (
		<div className='SettingsOverlay mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col'>
			<SettingsTabs activeTab={activeTab} onTabChange={setActiveTab}>
				{activeTab === 'mode' && <GameSettingsPanel />}
				{activeTab === 'sound' && <SoundSettingsPanel />}
				{activeTab === 'look' && <LookSettingsPanel />}
			</SettingsTabs>
		</div>
	);
}
