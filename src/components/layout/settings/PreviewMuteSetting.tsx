import { usePreviewSoloMuteConfirm } from '@/hooks/usePreviewSoloMuteConfirm';
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
				label='Preview'
				muted={mutePreview}
				title={
					mutePreview
						? 'Click to Unmute Preview (Listening Pass)'
						: 'Click to Mute Preview (Listening Pass)'
				}
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
