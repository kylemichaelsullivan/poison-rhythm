import { useSettings } from '@/contexts';
import { usePreviewSoloMuteConfirm } from '@/hooks/usePreviewSoloMuteConfirm';
import {
	MUTE_CHANNEL_LABELS,
	MUTE_PLAYBACK_AND_PREVIEW_LABEL,
} from '@/lib/settings-labels';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import { clickToTitle, muteActionLabel } from '@/lib/ui-copy';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound / Volume menu: student-pass rhythm mute. */
export function PlaybackMuteSetting() {
	const { settings } = useSettings();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);
	const { mutePlayback, mutePreview, requestMutePlayback } =
		usePreviewSoloMuteConfirm();
	const action = muteActionLabel(mutePlayback);
	const title = scrollMode
		? clickToTitle(action, MUTE_CHANNEL_LABELS.playback)
		: mutePlayback && mutePreview
			? clickToTitle(action, MUTE_PLAYBACK_AND_PREVIEW_LABEL)
			: clickToTitle(action, `${MUTE_CHANNEL_LABELS.playback} (Playing Pass)`);

	return (
		<MuteToggle
			label={MUTE_CHANNEL_LABELS.playback}
			muted={mutePlayback}
			title={title}
			onChange={requestMutePlayback}
		/>
	);
}
