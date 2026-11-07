import { useSettings } from '@/contexts';
import { usePreviewSoloMuteConfirm } from '@/hooks/usePreviewSoloMuteConfirm';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound / Volume menu: student-pass rhythm mute. */
export function PlaybackMuteSetting() {
	const { settings } = useSettings();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);
	const { mutePlayback, mutePreview, requestMutePlayback } =
		usePreviewSoloMuteConfirm();
	const title = scrollMode
		? mutePlayback
			? 'Click to Unmute Playback'
			: 'Click to Mute Playback'
		: mutePlayback && mutePreview
			? 'Click to Unmute Playback and Preview'
			: mutePlayback
				? 'Click to Unmute Playback (Playing Pass)'
				: 'Click to Mute Playback (Playing Pass)';

	return (
		<MuteToggle
			label='Playback'
			muted={mutePlayback}
			title={title}
			onChange={requestMutePlayback}
		/>
	);
}
