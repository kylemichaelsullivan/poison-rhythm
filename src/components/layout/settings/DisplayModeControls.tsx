import { Stack } from '@/components/ui';
import type { ScrollDirection } from '@/lib/settings-schema';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import { SegmentedControl } from './SegmentedControl';
import {
	RENDER_MODE_OPTIONS,
	SCROLL_DIRECTION_OPTIONS,
} from './settings-options';
import { useUpdateSetting } from './useUpdateSetting';
import { When } from './When';

/** Exclusive display mode: Grid, Notation, or Scroll (Guitar Hero–style highway). */
export function DisplayModeControls() {
	const { settings, set, updateSettings } = useUpdateSetting();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);
	const direction: Exclude<ScrollDirection, 'none'> =
		settings.scrollDirection === 'none' ? 'down' : settings.scrollDirection;

	return (
		<Stack gap='4'>
			<SegmentedControl
				ariaLabel='Display Mode'
				options={RENDER_MODE_OPTIONS}
				value={settings.rhythmRenderMode}
				onChange={(value) => {
					if (value === 'scroll') {
						updateSettings({
							rhythmRenderMode: 'scroll',
							scrollDirection:
								settings.scrollDirection === 'none'
									? 'down'
									: settings.scrollDirection,
						});
						return;
					}
					updateSettings({
						rhythmRenderMode: value,
						scrollDirection: 'none',
					});
					if (value === 'notation') {
						void import('@/lib/notation').then((module) =>
							module.loadMusiSyncFont(),
						);
					}
				}}
			/>
			<When condition={scrollMode}>
				<SegmentedControl
					legend='Direction'
					options={SCROLL_DIRECTION_OPTIONS}
					value={direction}
					onChange={(value) => set('scrollDirection', value)}
				/>
			</When>
		</Stack>
	);
}
