import { usePreviewSoloMuteConfirm } from '@/hooks/usePreviewSoloMuteConfirm';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound / Volume menu: student-pass rhythm mute. */
export function PlaybackMuteSetting() {
	const { mutePlayback, mutePreview, requestMutePlayback } =
		usePreviewSoloMuteConfirm();
	const title =
		mutePlayback && mutePreview
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
