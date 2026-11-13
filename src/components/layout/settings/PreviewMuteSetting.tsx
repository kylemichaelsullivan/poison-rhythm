import { usePreviewSoloMuteConfirm } from '@/hooks/usePreviewSoloMuteConfirm';
import { MUTE_CHANNEL_LABELS } from '@/lib/settings-labels';
import { clickToTitle, muteActionLabel } from '@/lib/ui-copy';
import { MuteToggle } from './MuteToggle';
import { PreviewMuteConfirmModal } from './PreviewMuteConfirmModal';

/** Settings → Sound / Volume menu: Listening-pass mute. */
export function PreviewMuteSetting() {
	const {
		mutePreview,
		requestMutePreview,
		confirmOpen,
		onCloseConfirm,
		onConfirm,
		onConfirmBoth,
	} = usePreviewSoloMuteConfirm();

	return (
		<>
			<MuteToggle
				label={MUTE_CHANNEL_LABELS.preview}
				muted={mutePreview}
				title={clickToTitle(
					muteActionLabel(mutePreview),
					`${MUTE_CHANNEL_LABELS.preview} (Listening Pass)`,
				)}
				onChange={requestMutePreview}
			/>
			<PreviewMuteConfirmModal
				open={confirmOpen}
				onClose={onCloseConfirm}
				onConfirm={onConfirm}
				onConfirmBoth={onConfirmBoth}
			/>
		</>
	);
}
