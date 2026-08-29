import { Stack } from '@/components/ui';
import { SegmentedControl } from './SegmentedControl';
import { SettingRow } from './SettingRow';
import { RENDER_MODE_OPTIONS } from './settings-options';
import { useUpdateSetting } from './useUpdateSetting';

/** Grid / notation; scroll highway is Coming Soon. */
export function DisplayModeControls() {
	const { settings, set } = useUpdateSetting();

	return (
		<Stack gap='4'>
			<SegmentedControl
				ariaLabel='Rhythm Render Mode'
				options={RENDER_MODE_OPTIONS}
				value={settings.rhythmRenderMode}
				onChange={(value) => {
					set('rhythmRenderMode', value);
					if (value === 'notation') {
						void import('@/lib/notation').then((module) =>
							module.loadMusiSyncFont(),
						);
					}
				}}
			/>
			<SettingRow label='Scroll'>
				<span className='text-sm text-muted'>Coming Soon</span>
			</SettingRow>
		</Stack>
	);
}
